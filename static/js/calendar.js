$(function () {
  $("<link rel='stylesheet' type='text/css' href='https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/2.1.1/fullcalendar.css' />").appendTo("head");
  //Backbone.js
  var Events = Backbone.Collection.extend({});//データ管理
  var EventsView = Backbone.View.extend({//表示管理
      // content id 取得
      el: document.getElementById("content"),

      render: function () {
          var self = this;
          var events = JSON.parse(localStorage.getItem('events'));
          var events = new Events(events);
          var jsevents = events.toJSON();//時間の参照

          // full-calendar生成する。
          self.$el.fullCalendar({
       
              axisFormat: 'HH:mm',
              timeFormat: {
                agenda: 'HH:mm',
                    '': 'hh(:mm)t',
              
              aspectRatio: 1.5,
              droppable: true,
              weekend: true,
              editable: true,
              eventStartEditable: true,
              eventDurationEditable: true,
              dragScroll: true,
          },
              buttonText: {
                  today:    '今日',
                  month:    '月',
                  week:     '週',
                  day:      '日'
              },

              monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
              monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
              dayNames: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
              dayNamesShort: ['日', '月', '火', '水', '木', '金', '土'],
              
              defaultView: 'month',
              firstDay: 1,
              handleWindowResize: true,
              // allDayDefault: true,
              firstHour: 7,
              columnFormat: {
                  month: 'ddd',
                  week: 'ddd',
                  day: 'dddd, MMM '
              },
              header: {
                  right: 'prev,next',
                  center: 'title',
                  left: 'month,agendaWeek,agendaDay'
              },
              
              selectable: true,
              selectHelper: true,

              // displayEventTime:true,

              // // displayEventEnd:{
              // //     month:true,
              // //     basicweek:true,
              // //     "default":true,
              // // },
              // // timeFormat:"HH:mm",

              //イベントの追加
              select: function (start, end) {
                  var title = prompt('Event Title:');
                  var eventData;
                  if (title) {
                      eventData = {
                          title: title,
                          start: start,
                          end: end,
                      };
                      self.$el.fullCalendar('renderEvent', eventData, true);
                      events.push(eventData);
                      localStorage.setItem('events', JSON.stringify(events));
                  }
                  self.$el.fullCalendar('unselect');
                  location.reload('true');
                  
              },

              //

              // eventDrop: function(event,delta,revertFunc,calEvent,jsEvent,ui,view){
              //     $('#calendar').fullCalendar("dropEvents", calEvent.start);
              //     localStorage.setItem('events', JSON.stringify(events));//書き込み
                  
              // },

              eventRender: function (calEvent, jsEvent, view, events) {
                      (jsEvent).bind('dblclick', function () {
                          if (!confirm('本当に削除しますか？')) {
                              return false;
                          } else {
                              $('#calendar').fullCalendar("removeEvents", calEvent._id);

                              let storageItem = JSON.parse(localStorage.getItem('events'));

                              var count = 0;
                              var num;
                              if (storageItem) {
                                  storageItem.forEach(element => {
                                      // console.log(element);
                                      // console.log(calEvent);
                                      if (element['title'] == calEvent['title'] && element['start'] == calEvent['start']['_i'] && element['end'] == calEvent['end']['_i']) {
                                          num = count;
                                      }
                                      count++;
                                  });
                                  // console.log(calEvent);
                                  // console.log(storageItem);
                                  // delete storageItem.calEvent;
                                  storageItem.splice(num, 1);
                                  localStorage.setItem('events', JSON.stringify(storageItem));
                              }
                              location.reload('true');

                          }
                      });
                  },

              events: function (start, end, timezone, callback) {
                  callback(jsevents);
              },
          });
      }
  });
  var view = new EventsView({
      el: '#calendar'
  });
  //view -> calender 
  view.render();
  
});