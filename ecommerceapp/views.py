from django.shortcuts import render

from rest_framework import viewsets, generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Product, CartItem, CustomUser, Order, OrderItem
from .serializers import (
    ProductSerializer, 
    CartItemReadSerializer, 
    CartItemWriteSerializer, 
    RegisterSerializer,
    OrderSerializer
)
from django.db import transaction
# --- 1. Authentication (Register) ---
class RegisterView(generics.CreateAPIView):
    """API untuk Pendaftaran Pengguna baru."""
    serializer_class = RegisterSerializer
    # Tidak perlu otentikasi untuk mendaftar
    permission_classes = (permissions.AllowAny,) 
    queryset = CustomUser.objects.all()

# --- 2. Product ViewSet ---
class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Menampilkan daftar produk dan detail produk."""
    queryset = Product.objects.filter(is_active=True, stock__gt=0)
    serializer_class = ProductSerializer
    permission_classes = (permissions.AllowAny,) # Produk dapat dilihat publik

# --- 3. Cart ViewSet ---
class CartItemViewSet(viewsets.ModelViewSet):
    """Mengelola item-item di keranjang pengguna yang sedang login."""
    # Cart hanya bisa diakses oleh pengguna yang terotentikasi
    permission_classes = (permissions.IsAuthenticated,) 
    
    def get_queryset(self):
        # Penting: Hanya kembalikan item keranjang untuk user yang sedang login
        return CartItem.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        # Gunakan Read Serializer untuk GET dan Write Serializer untuk POST/PUT/PATCH
        if self.action in ['list', 'retrieve']:
            return CartItemReadSerializer
        return CartItemWriteSerializer

    def perform_create(self, serializer):
        """Menambahkan user yang sedang login saat membuat CartItem baru."""
        # Tambahkan validasi unik (product-user) yang dilakukan di models.Meta
        # Jika item sudah ada, kita bisa mempertimbangkan untuk mengupdate quantity-nya
        try:
            cart_item = CartItem.objects.get(user=self.request.user, product=serializer.validated_data['product'])
            # Jika item sudah ada, update kuantitasnya
            cart_item.quantity += serializer.validated_data['quantity']
            cart_item.save()
            # Ini mungkin memerlukan penanganan Response custom
            return cart_item
        except CartItem.DoesNotExist:
            # Jika item belum ada, buat baru
            serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Pastikan kuantitas tidak nol atau negatif
        if serializer.validated_data.get('quantity') <= 0:
            instance = self.get_object()
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        serializer.save(user=self.request.user)

class CheckoutView(generics.GenericAPIView):
    """
    API untuk memproses checkout.
    Mengubah CartItem menjadi Order dan OrderItem.
    """
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = OrderSerializer # Untuk validasi input (jika ada) dan output

    def post(self, request, *args, **kwargs):
        user = request.user
        cart_items = CartItem.objects.filter(user=user)

        if not cart_items.exists():
            return Response({"error": "Keranjang Anda kosong."}, status=status.HTTP_400_BAD_REQUEST)

        # Asumsi 'shipping_address' dikirim dari frontend
        shipping_address = request.data.get('shipping_address')
        if not shipping_address:
            return Response({"error": "Alamat pengiriman diperlukan."}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = sum(item.get_total_price() for item in cart_items)

        # Gunakan 'transaction.atomic' agar aman
        # Jika satu langkah gagal, semua akan dibatalkan (rollback)
        try:
            with transaction.atomic():
                # 1. Buat Order
                order = Order.objects.create(
                    user=user,
                    total_amount=total_amount,
                    shipping_address=shipping_address,
                    status='PENDING' # Status awal
                )

                for item in cart_items:
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

                cart_items.delete()

                serializer = self.get_serializer(order)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)