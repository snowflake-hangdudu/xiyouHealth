import { useAppStoreOutside } from '@/store/modules/app'

export function createWatermark(title: string) {
  if (import.meta.env.VITE_USER_NODE_ENV == 'production') return
  // 创建canvas元素
  let canvas = document.createElement('canvas')
  // 获取绘图上下文对象
  let ctx = canvas.getContext('2d')!
  // 设置canvas的宽度和高度为屏幕的宽度和高度
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight * 2
  // 设置绘图上下文的字体、颜色、透明度等样式
  ctx.font = '14px Arial'
  ctx.fillStyle = 'rgba(0,0,0,0.05)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // 使用translate和rotate方法将坐标系平移和旋转45°
  ctx.translate(0, canvas.height / 2)
  ctx.rotate(Math.PI / 4)
  // 使用fillText方法在不同的位置绘制水印文字“测试环境”
  let gapX = 120 // 水印之间的间隔
  let gapY = 80 // 水印之间的间隔
  let x = -canvas.width // 水印的起始横坐标
  let y = -canvas.height // 水印的起始纵坐标
  while (y < canvas.height / 2) {
    while (x < canvas.width) {
      ctx.fillText(title, x, y)
      x += gapX
    }
    x = -canvas.width / 2
    y += gapY
  }
  // 使用toDataURL方法将canvas转换为base64编码的图片
  let base64 = canvas.toDataURL()
  // 创建一个img元素，并将其src属性设置为base64图片
  let img = document.createElement('img')
  img.src = base64
  // 创建一个div元素，并将其id属性设置为“watermark”
  let div = document.createElement('div')
  div.id = 'watermark'
  // 将img元素添加到div元素中，并将div元素添加到body元素中
  div.appendChild(img)
  document.body.appendChild(div)
  // 使用CSS样式设置div元素的位置、层级等属性，使其覆盖在网页上
  let style = document.createElement('style')
  style.innerHTML = `
    #watermark {
      position: fixed;
      top: 0;
      left: 0;
      width: ${canvas.width}px;
      height: ${canvas.height}px;
      z-index: 9999;
      pointer-events: none;
      transition: opacity 0.5s;
    }
    #watermark img {
      width: ${canvas.width}px;
      height: auto;
    }
    `
  document.head.appendChild(style)
  // 定义一个变量来存储定时器的id
  let timerId: any

  // 添加一个事件监听器，当屏幕大小改变时，先清除之前的定时器，然后设置一个新的定时器，在一定的时间间隔后再调用函数
  window.addEventListener('resize', function () {
    // 清除之前的定时器
    clearTimeout(timerId)
    div.style.opacity = '0'
    // 设置一个新的定时器，在500毫秒后再调用函数
    timerId = setTimeout(function () {
      // 移除原来的div元素
      document.body.removeChild(div)
      // 移除原来的style元素
      document.head.removeChild(style)
      // 再次调用函数
      createWatermark(title)
    }, 500)
  })

  // 将div元素的透明度先设置为0，然后再设置为1，实现出现动画
  div.style.opacity = '0'
  setTimeout(function () {
    div.style.opacity = '1'
  }, 10)

  window['setFakeProd'] = function (sysTitle, watermark) {
    const appStore = useAppStoreOutside()
    if (!watermark) {
      // 移除原来的div元素
      document.body.removeChild(div)
      // 移除原来的style元素
      document.head.removeChild(style)
    } else {
      // 移除原来的div元素
      document.body.removeChild(div)
      // 移除原来的style元素
      document.head.removeChild(style)
      // 再次调用函数
      createWatermark(title)
    }
    appStore.title = sysTitle || '管理系统'
    document.title = sysTitle || '管理系统'
  }
}
