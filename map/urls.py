from django.urls import path
from . import views

urlpatterns = [
  path('', views.IndexView.as_view(), name='index'),
  path('map/', views.MapView.as_view(), name='map'),
  path('calendar/', views.CalendarView.as_view(), name='calendar'),
  path('describe/', views.DescriveView.as_view(), name='describe'),
  path('onsei/', views.OnseiView.as_view(), name='onsei'),
]
