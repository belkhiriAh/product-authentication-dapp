from rest_framework import serializers
from Products.models import Product,HasRated,HasRatedCompany
from django.db import models

# class EmployeeSerializer(serializers.ModelSerializer):
#     # Meta data is important to serialize the fields in Employee Model
#     class Meta:
#         model = Employee
#         fields = ['pk','owner','eid', 'ename', 'email', 'phone']



class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(required=False)

    class Meta:
        model = Product 
        fields = ('pk','owner' ,'title', 'description', 
                #   'forsale', 
                   'price', 
                  'productid','image_url')

class HasRatedSerializer(serializers.ModelSerializer):

    class Meta:
        model = HasRated 
        fields = ('producId','sender')
    def create(self, validated_data):
        return HasRated.objects.get_or_create(producId=validated_data.pop("producId"), sender=validated_data.pop("sender"), defaults=validated_data)[0]
   

class HasRatedCompanySerializer(serializers.ModelSerializer):

    class Meta:
        model = HasRatedCompany 
        fields = ('companyAdress','sender')
    def create(self, validated_data):
        return HasRated.objects.get_or_create(companyAdress=validated_data.pop("companyAdress"), sender=validated_data.pop("sender"), defaults=validated_data)[0]
   