from django.shortcuts import render
from django.views import generic

# Create your views here.
class IndexView(generic.TemplateView):
  template_name="index.html"
class MapView(generic.TemplateView):
  template_name="map.html"
class CalendarView(generic.TemplateView):
  template_name="calendar.html"
class DescriveView(generic.TemplateView):
  template_name="describe.html"
class OnseiView(generic.TemplateView):
  template_name="onsei.html"
