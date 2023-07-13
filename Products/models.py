from django.db import models
# from django.contrib.auth.models import User # new

# # Create your models here.
# class Employee(models.Model):
#     eid = models.CharField(max_length=20)
#     owner= models.ForeignKey(User, on_delete=models.CASCADE) 
#     ename = models.CharField("Name", max_length=240)
#     email = models.EmailField()
#     phone = models.CharField(max_length=20)

#     def __str__(self):
#         return self.ename


def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)
from django.conf import settings
class Product(models.Model):

    owner= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE) 

    title = models.CharField(max_length=120)
    description = models.TextField()
    # forsale = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    productid=models.CharField(max_length=120)
    image_url = models.ImageField(upload_to=upload_to, blank=True, null=True)


    def _str_(self):
        return self.title
class HasRated(models.Model):



    producId=models.CharField(max_length=120)
    sender=models.CharField(max_length=120)


    def _str_(self):
        return self.producId
    
class HasRatedCompany(models.Model):



    companyAdress=models.CharField(max_length=120)
    sender=models.CharField(max_length=120)


    def _str_(self):
        return self.companyAdress
