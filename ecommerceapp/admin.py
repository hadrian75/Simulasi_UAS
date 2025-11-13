from django.contrib import admin
from .models import *
from django.contrib.admin import site
# Register your models here.
site.register(CustomUser)
site.register(Product)
site.register(CartItem)
site.register(Order)
site.register(OrderItem)
