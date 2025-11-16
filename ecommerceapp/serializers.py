from rest_framework import serializers
from .models import CustomUser, Product, CartItem, Order, OrderItem, Category
import re
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'first_name', 'last_name', 'password', 'password2'] 
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 6}
        }
    
    def validate_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password harus minimal 8 karakter.")
        
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password harus mengandung minimal satu angka.")
            
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
             raise serializers.ValidationError("Password harus mengandung minimal satu simbol.")
            
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Password field tidak cocok."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2') 
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        return token

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'image', 'category'] 
        read_only_fields = ['id', 'created_at']

class CartItemReadSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'total_price']
        
    def get_total_price(self, obj):
        return obj.get_total_price()

class CartItemWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['product', 'quantity'] 

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price'] 

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True) 
    user = UserPublicSerializer(read_only=True)
    seller = UserPublicSerializer(read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'user','seller', 'created_at', 'total_amount', 'status', 'shipping_address', 'items']
        read_only_fields = ['created_at', 'total_amount', 'status']
        
class SellerProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'image', 'is_active', 'category']
        read_only_fields = ['id', 'is_active']
        
class SellerOrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']
        
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name']
        read_only_fields = ['email', 'id']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Password lama Anda salah.")
        return value

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({"new_password": "Password baru tidak cocok."})
        return data

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError("Password harus minimal 8 karakter.")
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password harus mengandung minimal satu angka.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
             raise serializers.ValidationError("Password harus mengandung minimal satu simbol.")
        return value