from django.urls import path
from . import views
from . import extract_from_zip as ext


urlpatterns = [
  path('', views.IndexView.as_view(), name='index'),
  path('map/', views.MapView.as_view(), name='map'),
  path('calendar/', views.CalendarView.as_view(), name='calendar'),
  path('describe/', views.DescriveView.as_view(), name='describe'),
  path('onsei/', views.OnseiView.as_view(), name='onsei'),
  path('test/', views.TestView.as_view(), name='test'),
  path('', views.IndexView.as_view(), name='index'),
  path('ma9/zip/get', ext.ExtractFromZip.as_view(), name='ext-v'),
  path('ma9/zip', views.get_extract_from_zip, name='fnc2-v'),
]
