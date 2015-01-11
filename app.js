var fs = require('fs');
var rest = require('restler');
var cheerio = require('cheerio');
var EventProxy = require('eventproxy');
var ep = new EventProxy();

var url = [
'http://www.zhihu.com/question/26968485',
'http://www.zhihu.com/question/27441042',
'http://www.zhihu.com/question/23021337',
'http://www.zhihu.com/question/26758179',
'http://www.zhihu.com/question/27442419',
'http://www.zhihu.com/question/19858451',
'http://www.zhihu.com/question/25015549'
];
var output = '';
var index;


var order = 1;

load(0);

function load(index) {
  rest.get(url[index]).on('complete', function(result) {
    console.log('fetching no.' + order);
    order++;
    $ = cheerio.load(result, {
      normalizeWhitespace: false,
      xmlMode: false,
      decodeEntities: false
    });

    var answers = '';

    $('img').each(function() {
      $(this).attr('src', $(this).data('actualsrc'));
      $(this).css('margin', '20px 0')
    })

    $('noscript').remove();

    $('.toggle-expand').remove();

    $('.zm-item-answer').each(function(i, elem) {

      if (i < 7) {
        var user = $(this).find('.zm-item-answer-author-wrap').text();
        user = '<div style="font-weight:700;margin:10px 0;">▉ ' + user + '</div>';
        var answer = $(this).find('.zm-editable-content').html();
        if (!answer) answer = '>这个回复被知乎和谐了';
        answers += user + answer + '<hr>';
      }

    })



    var append = '<hr>';


    var title = $('.zm-item-title').html();
    if (!title) title = url[index];
    console.log(title)
    title = '<h2>' + title + '</h2>';

    var content = $('#zh-question-detail').find('.zm-editable-content').html();

    content += '<hr>';

    output += '<div>' + title + content + answers + '</div>';


    index++;
    if (index < url.length)
      ep.emit('next', index);


      if (index == url.length) {
        ep.emit('save', output);


      } else {
        output += append;
      }
    })
}



ep.tail('next', function(next) {
  load(next);
})


ep.tail('save', function(save) {
  fs.writeFile('output.html', save, function(err) {
    if (err) throw err;
    console.log('It\'s saved as html! now exporting to epub');
  });
});
