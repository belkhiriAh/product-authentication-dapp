
from .models import Product,HasRated,HasRatedCompany
from .serializers import ProductSerializer,HasRatedSerializer,HasRatedCompanySerializer
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import  IsAuthenticated


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    permission_classes=[IsAuthenticated]
    def get_queryset(self):
        user = self.request.user.id
        return Product.objects.filter(owner=user)

class HasRatedViewSet(viewsets.ModelViewSet):
    serializer_class = HasRatedSerializer
    queryset = HasRated.objects.all()
class HasRatedCompanyViewSet(viewsets.ModelViewSet):
    serializer_class = HasRatedCompanySerializer
    queryset = HasRatedCompany.objects.all()
  



from rest_framework.generics import ListAPIView

class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

