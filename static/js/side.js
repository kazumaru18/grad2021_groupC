$(function(){
  var duration = 250;
  var aside = $('.page_main > aside');
  var asidButton = aside.find('button')
      .on('click', function(){
          aside.toggleClass('open');
          if(aside.hasClass('open')){
              aside.stop(true).animate({left: '0px'}, duration);
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          }else{
              aside.stop(true).animate({left: '-350px'}, duration);
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          };
      });
});

$(function(){
  var duration = 250;
  var aside = $('.page_main2 > aside');
  var asidButton = aside.find('button')
      .on('click', function(){
          aside.toggleClass('open');
          if(aside.hasClass('open')){
              aside.stop(true).animate({left: '0px'}, duration);
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          }else{
              aside.stop(true).animate({left: '-350px'}, duration);
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          };
      });
});

$(function(){
  var duration = 250;
  var aside = $('.page_main3 > aside');
  var asidButton = aside.find('button')
      .on('click', function(){
          aside.toggleClass('open');
          if(aside.hasClass('open')){
              aside.stop(true).animate({left: '0px'}, duration);
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          }else{
              aside.stop(true).animate({left: '-350px'}, duration);
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          };
      });
});