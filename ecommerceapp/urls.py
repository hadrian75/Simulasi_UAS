from django.urls import path, include
from rest_framework.routers import DefaultRouter

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import ProductViewSet, CartItemViewSet, RegisterView, CheckoutView

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart', CartItemViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)), 
    
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
]