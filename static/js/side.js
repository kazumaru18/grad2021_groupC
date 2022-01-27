$(function(){
  var duration = 300;
  var aside = $('.page_main > aside');
  var asidButton = aside.find('button')
      .on('click', function(){
          aside.toggleClass('open');
          if(aside.hasClass('open')){
              aside.stop(true).animate({left: '-70px'}, duration, 'easeOutBack');
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          }else{
              aside.stop(true).animate({left: '-350px'}, duration, 'easeInBack');
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          };
      });
});

$(function(){
  var duration = 300;
  var aside = $('.page_main2 > aside');
  var asidButton = aside.find('button')
      .on('click', function(){
          aside.toggleClass('open');
          if(aside.hasClass('open')){
              aside.stop(true).animate({left: '-70px'}, duration, 'easeOutBack');
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          }else{
              aside.stop(true).animate({left: '-350px'}, duration, 'easeInBack');
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          };
      });
});

$(function(){
  var duration = 300;
  var aside = $('.page_main3 > aside');
  var asidButton = aside.find('button')
      .on('click', function(){
          aside.toggleClass('open');
          if(aside.hasClass('open')){
              aside.stop(true).animate({left: '-70px'}, duration, 'easeOutBack');
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          }else{
              aside.stop(true).animate({left: '-350px'}, duration, 'easeInBack');
              asidButton.find('img').attr('{% static "images/icon.png" %}');
          };
      });
});