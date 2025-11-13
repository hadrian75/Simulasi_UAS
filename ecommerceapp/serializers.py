# ecommerceapp/serializers.py
from rest_framework import serializers
from .models import CustomUser, Product, CartItem, Order, OrderItem
import re

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

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'image'] 
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
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity', 'price'] 

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True) 
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'created_at', 'total_amount', 'status', 'shipping_address', 'items']
        read_only_fields = ['user', 'created_at', 'total_amount', 'status']