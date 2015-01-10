var fs = require('fs');
var rest = require('restler');
var forEach = require('async-foreach').forEach;
var cheerio = require('cheerio');
var pdc = require('pdc');



var url = [
  'http://www.zhihu.com/question/27457502',
  'http://www.zhihu.com/question/24294198',
  'http://www.zhihu.com/question/26560907',
  'http://www.zhihu.com/question/21301235',
  'http://www.zhihu.com/question/20420964',
  'http://www.zhihu.com/question/25710791',
  'http://www.zhihu.com/question/20767176'
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
        answers += user + answer + '<div style="width:120px;background:#e2e2e2;height:1px;margin:20px 0;"></div>';
      }

    })



    var append = '<div style="width:100%;height:1px;background:#e2e2e2;margin:20px 0;"></div>';


    var title = $('.zm-item-title').html();
    title = '<h2>'+title+'</h2>';
    var content = $('.zm-editable-content').html();


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
