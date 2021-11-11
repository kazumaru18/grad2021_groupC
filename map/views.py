from django.shortcuts import render
from django.views import generic

# Create your views here.
class IndexView(generic.TemplateView):
    template_name="index.html"
class TestView(generic.TemplateView):
    template_name="test.html"
class Test2View(generic.TemplateView):
    template_name="test2.html"