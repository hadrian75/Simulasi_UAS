from django.shortcuts import render
from django.db import transaction
from collections import defaultdict

from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Product, CartItem, CustomUser, Order, OrderItem, Category
from .serializers import (
    ProductSerializer, 
    CartItemReadSerializer, 
    CartItemWriteSerializer, 
    RegisterSerializer,
    OrderSerializer,
    SellerProductSerializer,
    SellerOrderUpdateSerializer,
    CategorySerializer,
    ChangePasswordSerializer,
    UserProfileSerializer,
    MyTokenObtainPairSerializer
)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,) 
    queryset = CustomUser.objects.all()

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = (permissions.AllowAny,)
    
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']
    filterset_fields = ['category__slug']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True, stock__gt=0)
        
        category_slug = self.request.query_params.get('category__slug', None)
        
        if category_slug is not None:
            queryset = queryset.filter(category__slug=category_slug)
            
        return queryset

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)

class CartItemViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,) 
    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return CartItemReadSerializer
        return CartItemWriteSerializer

    def perform_create(self, serializer):
        try:
            cart_item = CartItem.objects.get(user=self.request.user, product=serializer.validated_data['product'])
            cart_item.quantity += serializer.validated_data['quantity']
            cart_item.save()
        except CartItem.DoesNotExist:
            serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.validated_data.get('quantity') <= 0:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer.save(user=self.request.user)

class CheckoutView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = OrderSerializer 

    def post(self, request, *args, **kwargs):
        user = request.user
        cart_items = CartItem.objects.filter(user=user).select_related('product__seller')

        if not cart_items.exists():
            return Response({"error": "Keranjang Anda kosong."}, status=status.HTTP_400_BAD_REQUEST)

        for item in cart_items:
            if not item.product.seller:
                return Response(
                    {"error": f"Produk '{item.product.name}' tidak memiliki penjual dan tidak dapat dibeli."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

        shipping_address = request.data.get('shipping_address')
        if not shipping_address:
            return Response({"error": "Alamat pengiriman diperlukan."}, status=status.HTTP_400_BAD_REQUEST)

        seller_cart_groups = defaultdict(list)
        for item in cart_items:
            seller = item.product.seller
            seller_cart_groups[seller].append(item)

        created_orders = []

        try:
            with transaction.atomic():
                for seller, items in seller_cart_groups.items():
                    
                    total_amount = sum(item.get_total_price() for item in items)

                    order = Order.objects.create(
                        user=user,              
                        seller=seller,          
                        total_amount=total_amount,
                        shipping_address=shipping_address,
                        status='PENDING'
                    )

                    for item in items:
                        OrderItem.objects.create(
                            order=order,
                            product=item.product,
                            quantity=item.quantity,
                            price=item.product.price 
                        )
                        
                        product = item.product
                        if product.stock < item.quantity:
                            raise Exception(f'Stok untuk {product.name} tidak mencukupi.')
                        product.stock -= item.quantity
                        product.save()

                    created_orders.append(order)
                
                cart_items.delete()

            serializer = self.get_serializer(created_orders, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

class UserProfileView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({"detail": "Password berhasil diubah."}, status=status.HTTP_200_OK)

class SellerProductViewSet(viewsets.ModelViewSet):
    serializer_class = SellerProductSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Product.objects.filter(seller=self.request.user)

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)

class SellerSalesViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        return Order.objects.filter(seller=self.request.user).order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'update' or self.action == 'partial_update':
            return SellerOrderUpdateSerializer
        return OrderSerializer
    
    def perform_update(self, serializer):
        serializer.save()