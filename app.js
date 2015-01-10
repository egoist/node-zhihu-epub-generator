var fs = require('fs');
var rest = require('restler');
var forEach = require('async-foreach').forEach;
var cheerio = require('cheerio');



var url = [
  'http://www.zhihu.com/question/27478526',
  'http://www.zhihu.com/question/27441042',
  'http://www.zhihu.com/question/23021337',
  'http://www.zhihu.com/question/26758179',
  'http://www.zhihu.com/question/27480171',
  'http://www.zhihu.com/question/19858451',
  'http://www.zhihu.com/question/27448909'
];
var output = '';


forEach(url, function(post, index, arr){
  var answers = '';
  var order = index + 1;
  console.log('fetching no.'+order);
  rest.get(url[index]).on('complete', function(result) {

    $ = cheerio.load(result);

    $('img').each(function(){
      $(this).attr('src',$(this).data('actualsrc'));
      $(this).css('margin','20px 0')
    })

    $('.toggle-expand').remove();

    $('.zm-item-answer').each(function(i,elem){

      if(i < 10){
        var user = $(this).find('.zm-item-answer-author-wrap').text();
        user = '<div style="font-weight:700;margin:10px 0;">▉ '+user+'</div>';
        var answer = $(this).find('.zm-editable-content').html();
        answers += user + answer + '<hr>';
      }

    })



    var append = '<hr>';


    var title = $('.zm-item-title').html();
    title = '<h2>'+title+'</h2>';
    var content = $('#zh-question-detail').find('.zm-editable-content').html();
    content += '<hr>';

    output += '<div>' + title + content + answers + '</div>';

    if(index == url.length - 1){

        fs.writeFile('output.html', output, function (err) {
          if (err) throw err;
          console.log('It\'s saved!');
        });


    }else{
      output += append;
    }

  })
})
