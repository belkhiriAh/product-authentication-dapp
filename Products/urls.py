# from .views import ProductViewSet
# from rest_framework.routers import DefaultRouter
from . import views

# router = DefaultRouter()
# router.register(r'products', views.ProductViewSet, basename='employees')
# urlpatterns = router.urls


from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'products', views.ProductViewSet,basename="products")
router.register(r'hasrated_company', views.HasRatedCompanyViewSet,basename="hasrated_company")
router.register(r'hasrated', views.HasRatedViewSet,basename="hasrated")

# The API URLs are now determined automatically by the router.
urlpatterns = [
    path('productsList/', views.ProductListView.as_view()),
    # path('productsList/', views.HasRatedViewSet.as_view()),
    path('', include(router.urls)),

]
# from django.urls import include, path

# from .views import ProductListView,ProductViewSet

# urlpatterns = [
#     path('products/', ProductViewSet.as_view()),
 
# ]
