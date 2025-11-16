from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email harus disetel')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser harus memiliki is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser harus memiliki is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True) 
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email' 
    REQUIRED_FIELDS = [] 

    objects = CustomUserManager()

    groups = models.ManyToManyField(
        Group,
        blank=True,
        related_name="customuser_groups", 
        related_query_name="customuser",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        blank=True,
        related_name="customuser_permissions", # Nama unik untuk menghindari bentrok
        related_query_name="customuser",
    )

    def __str__(self):
        return self.email

class Product(models.Model):
    seller = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2) 
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True, related_name='products')

    def __str__(self):
        return self.name

class CartItem(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='cart_items') 
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product') 

    def get_total_price(self):
        return self.quantity * self.product.price

    def __str__(self):
        return f'{self.quantity} x {self.product.name} by {self.user.email}'

class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    )
    
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='orders')
    seller = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='sales')
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    shipping_address = models.TextField()
    
    def __str__(self):
        return f'Order {self.id} by {self.user.email}'

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True) 
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2) 
        
    def __str__(self):
        return f'{self.quantity} x {self.product.name if self.product else "Deleted Product"}' 

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    
    class Meta:
        verbose_name_plural = "Categories" 

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name