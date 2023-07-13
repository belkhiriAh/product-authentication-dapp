from django.urls import include, path

from .views import UserListView,current_user_id

urlpatterns = [
    path('', UserListView.as_view()),
    path('auth/', include('rest_auth.urls')),
    path('auth/register/', include('rest_auth.registration.urls')),
    path('current_user_id/', current_user_id),
]
