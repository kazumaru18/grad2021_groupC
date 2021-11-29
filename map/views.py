from django.shortcuts import render
from django.views import generic

# Create your views here.
class IndexView(generic.TemplateView):
    template_name="index.html"
class MapView(generic.TemplateView):
    template_name="map.html"
class TestView(generic.TemplateView):
    template_name="test.html"
class Test2View(generic.TemplateView):
    template_name="test2.html"
class Test3View(generic.TemplateView):
    template_name="test3.html"
class Test4View(generic.TemplateView):
    template_name="test4.html"
class Test5View(generic.TemplateView):
    template_name="test5.html"
class Test6View(generic.TemplateView):
    template_name="test6.html"
