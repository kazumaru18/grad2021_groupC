from django.urls import path
from . import views

urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('map/', views.MapView.as_view(), name='map'),
    path('test', views.TestView.as_view(), name='test'),
    path('test2', views.Test2View.as_view(), name='test2'),
    path('test3', views.Test3View.as_view(), name='test3'),
    path('test4', views.Test4View.as_view(), name='test4'),
    path('test5', views.Test5View.as_view(), name='test5'),
    path('test6', views.Test6View.as_view(), name='test6'),
]