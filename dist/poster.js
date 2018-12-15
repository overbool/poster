/*! @overbool/poster v1.0.1 | (c) 2018 Overbool | https://github.com/overbool/poster */
"use strict";

// post class
var poster = function () {
  var DEBUG = false;
  var WIDTH = 768;
  var HEIGHT = 1168;

  function init(config) {
    var $container = document.querySelector(config.selector);
    $container.style.border = '1px solid #f0f0f0';
    var $wrapper = createDom('div', 'id', 'wrapper');
    var $canvas = createDom('canvas', 'id', 'canvas', 'block');
    var $author = createDom('canvas', 'id', 'author');
    var $day = createDom('canvas', 'id', 'day');
    var $date = createDom('canvas', 'id', 'date');
    var $title = createDom('canvas', 'id', 'title');
    var $content = createDom('canvas', 'id', 'content');
    var $logo = createDom('canvas', 'id', 'logo');
    var $description = createDom('canvas', 'id', 'description');
    var $qrcode = createDom('canvas', 'id', 'qrcode');
    var $qrcodeDesc = createDom('canvas', 'id', 'qrcode-desc');
    appendChilds($wrapper, $canvas, $author, $day, $date, $title, $content, $logo, $description, $qrcode, $qrcodeDesc);
    $container.appendChild($wrapper); // author

    var authorStyle = {
      font: 'italic 45px Arial',
      color: 'rgba(255, 255, 255, 1)',
      position: 'left'
    };
    drawOneline($author, authorStyle, config.author); // day

    var date = new Date();
    var dayStyle = {
      font: 'italic bold 70px Arial',
      color: 'rgba(255, 255, 255, 1)',
      position: 'right'
    };
    drawOneline($day, dayStyle, date.getDate()); // date

    var dateStyle = {
      font: 'italic 30px Arial',
      color: 'rgba(255, 255, 255, 1)',
      position: 'right'
    };
    drawOneline($date, dateStyle, date.getFullYear() + ' / ' + (date.getMonth() + 1)); // title canvas

    var titleStyle = {
      font: 'bold 50px Arial',
      color: 'rgba(66, 66, 66, 1)',
      position: 'center'
    };
    titleStyle.font = config.titleStyle && config.titleStyle.font || titleStyle.font;
    titleStyle.color = config.titleStyle && config.titleStyle.color || titleStyle.color;
    titleStyle.position = config.titleStyle && config.titleStyle.position || titleStyle.position;
    drawOneline($title, titleStyle, config.title); // content canvas

    var contentStyle = {
      font: '24px Arial',
      lineHeight: 1.5,
      position: 'center',
      color: 'rgba(88, 88, 88, 1)'
    };
    contentStyle.font = config.contentStyle && config.contentStyle.font || contentStyle.font;
    contentStyle.color = config.contentStyle && config.contentStyle.color || contentStyle.color;
    contentStyle.lineHeight = config.contentStyle && config.contentStyle.lineHeight || contentStyle.lineHeight;
    contentStyle.position = config.contentStyle && config.contentStyle.position || contentStyle.position;
    drawMoreLines($content, contentStyle, config.content); // logo

    var logoStyle = {
      font: 'bold 40px Roboto Slab',
      position: 'center',
      color: 'rgba(0, 0, 25, 1)'
    };
    logoStyle.color = config.logoStyle && config.logoStyle.color || logoStyle.color;
    $logo.width *= 0.7;
    drawOneline($logo, logoStyle, config.logo); // description

    var descriptionStyle = {
      font: '24px Arial',
      color: 'rgba(180, 180, 180, 1)',
      lineHeight: 1.1,
      position: 'center'
    };
    $description.width *= 0.7777777;
    drawMoreLines($description, descriptionStyle, config.description); // qrcode desc

    var qrcodeDescStyle = {
      font: '28px Arial',
      color: 'rgba(88, 88, 88, 1)',
      lineHeight: 1.1,
      position: 'center'
    };
    $qrcodeDesc.width *= 0.7;
    drawOneline($qrcodeDesc, qrcodeDescStyle, config.qrcodeDesc); // background image

    var image = new Image();
    var qrcodeImg = new Image();

    var onload = function onload() {
      $canvas.width = WIDTH;
      $canvas.height = HEIGHT; // load background image

      image.src = config.banner;
      image.onload = render; // load qrcode

      qrcodeImg.src = config.qrcode;

      qrcodeImg.onload = function () {};
    };

    window.addEventListener("load", onload, false);

    var render = function render() {
      var ctx = $canvas.getContext('2d');
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.fillRect(0, 0, $canvas.width, $canvas.height);
      ctx.drawImage(image, 0, 0, $canvas.width, $canvas.height / 2);
      ctx.drawImage($author, 15, 15);
      ctx.drawImage($day, 0, $canvas.height / 2 - 120);
      ctx.drawImage($date, 0, $canvas.height / 2 - 50);
      ctx.drawImage($title, 0, $canvas.height / 2 + 75);
      ctx.drawImage($content, 0, $canvas.height / 2 + 185);
      ctx.drawImage($logo, 0, $canvas.height - $logo.height - 25);
      ctx.drawImage($description, 0, $canvas.height - $description.height + 20);
      ctx.drawImage($qrcodeDesc, 0, $canvas.height - $description.height - 25);
      ctx.drawImage(qrcodeImg, $canvas.width * 0.7 + 20, $canvas.height - $description.height - 30, $canvas.width * 0.2, $canvas.width * 0.2);
      ctx.strokeStyle = 'rgba(122, 122, 122, 0.5)';
      ctx.setLineDash([5, 6]);
      ctx.moveTo(0, $canvas.height / 2 + 365);
      ctx.lineTo(768, $canvas.height / 2 + 365);
      ctx.stroke();
      var img = new Image();
      img.src = $canvas.toDataURL('image/png');
      var radio = config.radio || 0.7;
      img.width = WIDTH * radio;
      img.height = HEIGHT * radio;
      ctx.clearRect(0, 0, $canvas.width, $canvas.height);
      $canvas.style.display = 'none';
      $container.appendChild(img);
      $container.removeChild($wrapper);

      if (config.callback) {
        config.callback($container);
      }
    };
  }

  function createDom(name, key, value) {
    var display = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'none';
    var $dom = document.createElement(name);
    $dom.setAttribute(key, value);
    $dom.style.display = display;
    $dom.width = WIDTH;
    return $dom;
  }

  function appendChilds(parent) {
    for (var _len = arguments.length, doms = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      doms[_key - 1] = arguments[_key];
    }

    doms.forEach(function (dom) {
      parent.appendChild(dom);
    });
  }

  function drawOneline(canvas, style, content) {
    var ctx = canvas.getContext('2d');
    canvas.height = parseInt(style.font.match(/\d+/), 10) + 20;
    ctx.font = style.font;
    ctx.fillStyle = style.color;
    ctx.textBaseline = 'top';
    var lineWidth = 0;
    var idx = 0;
    var truncated = false;

    for (var i = 0; i < content.length; i++) {
      lineWidth += ctx.measureText(content[i]).width;

      if (lineWidth > canvas.width - 60) {
        truncated = true;
        idx = i;
        break;
      }
    }

    var padding = 30;

    if (truncated) {
      content = content.substring(0, idx);
      padding = canvas.width / 2 - lineWidth / 2;
    }

    if (DEBUG) {
      ctx.strokeStyle = "#6fda92";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    if (style.position === 'center') {
      ctx.textAlign = 'center';
      ctx.fillText(content, canvas.width / 2, 0);
    } else if (style.position === 'left') {
      ctx.fillText(content, padding, 0);
    } else {
      ctx.textAlign = 'right';
      ctx.fillText(content, canvas.width - padding, 0);
    }
  }

  function drawMoreLines(canvas, style, content) {
    var ctx = canvas.getContext('2d');
    var fontHeight = parseInt(style.font.match(/\d+/), 10);

    if (DEBUG) {
      ctx.strokeStyle = "#6fda92";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    ctx.font = style.font;
    ctx.fillStyle = style.color;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    var alignX = 0;

    if (style.position === 'center') {
      alignX = canvas.width / 2;
    } else if (style.position === 'left') {
      ctx.textAlign = 'left';
      alignX = 60;
    } else {
      ctx.textAlign = 'right';
      alignX = canvas.width - 60;
    }

    var lineWidth = 0;
    var lastSubStrIndex = 0;
    var offsetY = 0;

    for (var i = 0; i < content.length; i++) {
      lineWidth += ctx.measureText(content[i]).width;

      if (lineWidth > canvas.width - 120) {
        ctx.fillText(content.substring(lastSubStrIndex, i), alignX, offsetY);
        offsetY += fontHeight * style.lineHeight;
        lineWidth = 0;
        lastSubStrIndex = i;
      }

      if (i === content.length - 1) {
        ctx.fillText(content.substring(lastSubStrIndex, i + 1), alignX, offsetY);
      }
    }
  }

  return {
    init: init
  };
}();