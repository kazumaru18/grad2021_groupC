from django.shortcuts import render
from django.views import generic
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
import codecs

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
class TestView(generic.TemplateView):
  template_name="test.html"


@api_view(['GET', 'POST'])
def get_extract_from_zip(request):
    resp = requests.get(
        'http://ap.mextractr.net/ma9/mext5w1h?out=atom&apikey=17333CBF6A1D9B2E29B84A012D2AAF2C498735C7&text=マクドナルド',
        )
    return Response(resp, status=resp.status_code)