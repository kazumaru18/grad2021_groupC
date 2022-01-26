from django import forms
from django.core.mail import EmailMessage

class InquiryForm(forms.Form):
    name = forms.CharField(label="お名前", max_length=30)
    email = forms.EmailField(label="メールアドレス")
    message = forms.CharField(label="メッセージ", widget=forms.Textarea)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        self.fields['name'].widget.attrs['class'] = 'forms-control col-9  Form-Item-Input'
        self.fields['name'].widget.attrs['placeholder'] = "例）山田太郎"
        self.fields['email'].widget.attrs['class'] = 'forms-control col-11  Form-Item-Input'
        self.fields['email'].widget.attrs['placeholder'] = "例）sample@yahoo.co.jp"
        self.fields['message'].widget.attrs['class'] = 'forms-control col-11 Form-Item-Textarea'