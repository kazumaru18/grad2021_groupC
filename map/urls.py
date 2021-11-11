from django.urls import path
from . import views

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('test', views.TestView.as_view(), name='test'),
    path('test2', views.Test2View.as_view(), name='test2'),
]
