from django.contrib import admin
from .models import Product,HasRated,HasRatedCompany
# Register your models here.

admin.site.register(Product)
admin.site.register(HasRatedCompany)
admin.site.register(HasRated)
