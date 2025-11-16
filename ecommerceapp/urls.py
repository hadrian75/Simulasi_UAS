from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ProductViewSet,
    CartItemViewSet,
    RegisterView,
    CheckoutView,
    OrderViewSet,
    SellerProductViewSet,
    SellerSalesViewSet,
    CategoryViewSet,
    MyTokenObtainPairView,
    UserProfileView,
    ChangePasswordView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart', CartItemViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'categories', CategoryViewSet, basename='category')

dashboard_router = DefaultRouter()
dashboard_router.register(r'products', SellerProductViewSet, basename='seller-products')
dashboard_router.register(r'sales', SellerSalesViewSet, basename='seller-sales')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', include(dashboard_router.urls)),

    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('checkout/', CheckoutView.as_view(), name='checkout'),

    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='change-password'),
]