from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from .models import CustomUser
from .serializers import UserSerializer


class UserListView(ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


from rest_framework.decorators import api_view
from .serializers import UserIdSerializer
from rest_framework.response import Response

@api_view(['GET'])
def current_user_id(request):
    """
    Determine the current user by their token, and return their data
    """

    serializer = UserIdSerializer(request.user)
    return Response(serializer.data)
