// post class
const poster = (function () {

  const DEBUG = false

  const WIDTH = 768
  const HEIGHT = 1168

  function init(config) {
    const $container = document.querySelector(config.selector)
    $container.style.border = '1px solid #f0f0f0'
    const $wrapper = createDom('div', 'id', 'wrapper')
    const $canvas = createDom('canvas', 'id', 'canvas', 'block')
    const $author = createDom('canvas', 'id', 'author')
    const $day = createDom('canvas', 'id', 'day')
    const $date = createDom('canvas', 'id', 'date')
    const $title = createDom('canvas', 'id', 'title')
    const $content = createDom('canvas', 'id', 'content')
    const $logo = createDom('canvas', 'id', 'logo')
    const $description = createDom('canvas', 'id', 'description')
    const $qrcode = createDom('canvas', 'id', 'qrcode')
    const $qrcodeDesc = createDom('canvas', 'id', 'qrcode-desc')

    appendChilds($wrapper, $canvas, $author, $day, $date, $title, $content, $logo, $description, $qrcode, $qrcodeDesc)
    $container.appendChild($wrapper)

    // author
    const authorStyle = {
      font: 'italic 45px Arial',
      color: 'rgba(255, 255, 255, 1)',
      position: 'left'
    }
    drawOneline($author, authorStyle, config.author)

    // day
    const date = new Date()
    const dayStyle = {
      font: 'italic bold 70px Arial',
      color: 'rgba(255, 255, 255, 1)',
      position: 'right'
    }
    drawOneline($day, dayStyle, date.getDate());

    // date
    const dateStyle = {
      font: 'italic 30px Arial',
      color: 'rgba(255, 255, 255, 1)',
      position: 'right'
    }
    drawOneline($date, dateStyle, date.getFullYear() + ' / ' + (date.getMonth() + 1))

    // title canvas
    const titleStyle = {
      font: 'bold 50px Arial',
      color: 'rgba(66, 66, 66, 1)',
      position: 'center'
    }
    titleStyle.font = (config.titleStyle && config.titleStyle.font) || titleStyle.font
    titleStyle.color = (config.titleStyle && config.titleStyle.color) || titleStyle.color
    titleStyle.position = (config.titleStyle && config.titleStyle.position) || titleStyle.position
    drawOneline($title, titleStyle, config.title)

    // content canvas
    const contentStyle = {
      font: '24px Arial',
      lineHeight: 1.5,
      position: 'center',
      color: 'rgba(88, 88, 88, 1)'
    }
    contentStyle.font = (config.contentStyle && config.contentStyle.font) || contentStyle.font
    contentStyle.color = (config.contentStyle && config.contentStyle.color) || contentStyle.color
    contentStyle.lineHeight = (config.contentStyle && config.contentStyle.lineHeight) || contentStyle.lineHeight
    contentStyle.position = (config.contentStyle && config.contentStyle.position) || contentStyle.position
    drawMoreLines($content, contentStyle, config.content);

    // logo
    const logoStyle = {
      font: 'bold 40px Roboto Slab',
      position: 'center',
      color: 'rgba(0, 0, 25, 1)'
    }
    logoStyle.color = (config.logoStyle && config.logoStyle.color) || logoStyle.color
    $logo.width *= 0.7
    drawOneline($logo, logoStyle, config.logo)

    // description
    const descriptionStyle = {
      font: '24px Arial',
      color: 'rgba(180, 180, 180, 1)',
      lineHeight: 1.1,
      position: 'center'
    }
    $description.width *= 0.7777777
    drawMoreLines($description, descriptionStyle, config.description)

    // qrcode desc
    const qrcodeDescStyle = {
      font: '28px Arial',
      color: 'rgba(88, 88, 88, 1)',
      lineHeight: 1.1,
      position: 'center'
    }
    $qrcodeDesc.width *= 0.7
    drawOneline($qrcodeDesc, qrcodeDescStyle, config.qrcodeDesc)

    // background image
    const image = new Image();
    const qrcodeImg = new Image();
    const run = function () {
      $canvas.width = WIDTH
      $canvas.height = HEIGHT

      // load background image and qrcode
      qrcodeImg.crossOrigin = 'Anonymous'
      image.crossOrigin = 'Anonymous'
      qrcodeImg.src = config.qrcode
      qrcodeImg.onload = function() {
        image.src = config.banner
        image.onload = render
      }
    }

    run()

    const render = function() {
        const ctx = $canvas.getContext('2d')
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        ctx.fillRect(0, 0, $canvas.width, $canvas.height)
        ctx.drawImage(image, 0, 0, $canvas.width, $canvas.height / 2)
        ctx.drawImage($author, 15, 15)
        ctx.drawImage($day, 0, $canvas.height / 2 - 120)
        ctx.drawImage($date, 0, $canvas.height / 2 - 50)
        ctx.drawImage($title, 0, $canvas.height / 2 + 75)
        ctx.drawImage($content, 0, $canvas.height / 2 + 185)
        ctx.drawImage($logo, 0, $canvas.height - $logo.height - 25)
        ctx.drawImage($description, 0, $canvas.height - $description.height + 20)
        ctx.drawImage($qrcodeDesc, 0, $canvas.height - $description.height - 25)
        ctx.drawImage(qrcodeImg, $canvas.width*0.7 + 20, $canvas.height - $description.height - 30, $canvas.width * 0.2, $canvas.width * 0.2)
        ctx.strokeStyle = 'rgba(122, 122, 122, 0.5)'
        ctx.setLineDash([5, 6]);
        ctx.moveTo(0, $canvas.height / 2 + 365)
        ctx.lineTo(768, $canvas.height / 2 + 365)
        ctx.stroke()

        const img = new Image();
        img.src = $canvas.toDataURL('image/png')
        const radio = config.radio || 0.7
        img.width = WIDTH * radio
        img.height = HEIGHT * radio

        ctx.clearRect(0, 0, $canvas.width, $canvas.height)
        $canvas.style.display = 'none'
        $container.appendChild(img);
        $container.removeChild($wrapper)
        if (config.callback) {
          config.callback($container)
        }
    }
  }

  function createDom(name, key, value, display = 'none') {
    const $dom = document.createElement(name)
    $dom.setAttribute(key, value)
    $dom.style.display = display
    $dom.width = WIDTH
    return $dom
  }

  function appendChilds(parent, ...doms) {
    doms.forEach(dom => {
      parent.appendChild(dom)
    })
  }

  function drawOneline(canvas, style, content) {
    const ctx = canvas.getContext('2d')
    canvas.height = parseInt(style.font.match(/\d+/), 10) + 20
    ctx.font = style.font
    ctx.fillStyle = style.color
    ctx.textBaseline = 'top'

    let lineWidth = 0
    let idx = 0
    let truncated = false
    for (let i = 0; i < content.length; i++) {
      lineWidth += ctx.measureText(content[i]).width;
      if (lineWidth > canvas.width - 60) {
        truncated = true
        idx = i
        break
      }
    }

    let padding = 30

    if (truncated) {
      content = content.substring(0, idx)
      padding = canvas.width / 2 - lineWidth / 2
    }

    if (DEBUG) {
      ctx.strokeStyle = "#6fda92";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    if (style.position === 'center') {
      ctx.textAlign = 'center';
      ctx.fillText(content, canvas.width / 2, 0)
    } else if (style.position === 'left') {
      ctx.fillText(content, padding, 0)
    } else {
      ctx.textAlign = 'right'
      ctx.fillText(content, canvas.width - padding, 0)
    }
  }

  function drawMoreLines(canvas, style, content) {
    const ctx = canvas.getContext('2d')
    const fontHeight = parseInt(style.font.match(/\d+/), 10)

    if (DEBUG) {
      ctx.strokeStyle = "#6fda92";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }

    ctx.font = style.font
    ctx.fillStyle = style.color
    ctx.textBaseline = 'top'
    ctx.textAlign = 'center'

    let alignX = 0

    if (style.position === 'center') {
      alignX = canvas.width / 2;
    } else if (style.position === 'left') {
      ctx.textAlign = 'left'
      alignX = 60
    } else {
      ctx.textAlign = 'right'
      alignX = canvas.width - 60
    }

    let lineWidth = 0
    let lastSubStrIndex = 0
    let offsetY = 0
    for (let i = 0; i < content.length; i++) {
      lineWidth += ctx.measureText(content[i]).width;
      if (lineWidth > canvas.width - 120) {
        ctx.fillText(content.substring(lastSubStrIndex, i), alignX, offsetY);
        offsetY += fontHeight * style.lineHeight
        lineWidth = 0
        lastSubStrIndex = i
      }
      if (i === content.length - 1) {
        ctx.fillText(content.substring(lastSubStrIndex, i + 1), alignX, offsetY);
      }
    }
  }

  return {
    init
  }
})()
