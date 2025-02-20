<script setup lang="ts">
import { ref, watch, computed, onMounted, unref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { delayDuration } from '@/utils/async'
import CoinIcon from '@/assets/imgs/gold_coin.png'
import GsIcon from '@/assets/imgs/logo.png'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('logo')

const appStore = useAppStore()

const show = ref(true)

const title = computed(() => appStore.getTitle)

const layout = computed(() => appStore.getLayout)

const collapse = computed(() => appStore.getCollapse)

onMounted(() => {
  if (unref(collapse)) show.value = false
})

watch(
  () => collapse.value,
  (collapse: boolean) => {
    if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
      show.value = true
      return
    }
    if (!collapse) {
      setTimeout(() => {
        show.value = !collapse
      }, 400)
    } else {
      show.value = !collapse
    }
  }
)

watch(
  () => layout.value,
  (layout) => {
    if (layout === 'top' || layout === 'cutMenu') {
      show.value = true
    } else {
      if (unref(collapse)) {
        show.value = false
      } else {
        show.value = true
      }
    }
  }
)

let count = 0
let lock = false

async function start() {
  if (lock) return
  if (count < 20) return count++
  lock = true
  snowWithParams(100, 60)
  lock = false
  count = 0
}

async function snowWithParams(count = 1999, sequence = 3) {
  console.warn(`撒币数: ${count} 预计持续: ${(count * sequence) / 1000}s `)
  const isGs = Math.random() > 0.7
  for (let i = 0; i < count; i++) {
    snow(isGs)
    await delayDuration(sequence)
  }
}

window['becomeRich'] = snowWithParams

//创建雪花元素
function snow(isGs: boolean) {
  //获取视窗的宽高
  var width = window.innerWidth
  var height = window.innerHeight

  var snow = document.createElement('div') //创建元素

  //初始化雪花样式
  let size = Math.random() * 18 + 22 //随机生成雪花大小
  snow.style.width = size + 'px'
  snow.style.height = size + 'px'
  // snow.style.background = "url(img/雪花-0" + Math.floor((Math.random()*6)+1) + ".png) no-repeat";     //随机选择雪花的图片
  if (!isGs) {
    snow.style.background = `url(${CoinIcon}) no-repeat`
  } else {
    snow.style.background = `url(${GsIcon}) no-repeat`
  }
  snow.style.backgroundSize = '100% 100%'
  snow.style.position = 'fixed' //给图片设置高斯模糊
  snow.style.left = Math.random() * width + 'px' //随机生成雪花的初始位置
  snow.style.top = '10px'
  snow.style.zIndex = '999'

  //向body添加元素
  document.body.appendChild(snow)

  //创建定时器，每30ms雪花下落一次
  var timer = setInterval(function () {
    snow.style.top = parseInt(snow.style.top) + 4 + 'px' //每次下落8px

    //当雪花到达底部后清除元素
    if (parseInt(snow.style.top) >= height) {
      clearInterval(timer)
      snow.parentNode?.removeChild(snow)
    }
  }, 15)
}
</script>

<template>
  <router-link
    :class="[
      prefixCls,
      layout !== 'classic' ? `${prefixCls}__Top` : '',
      'flex !h-[var(--logo-height)] items-center cursor-pointer pl-16px relative',
      'dark:bg-[var(--el-bg-color)]'
    ]"
    to="/"
    @click="start">
    <img src="/src/assets/imgs/logo.png" class="w-[calc(var(--logo-height)-30px)] h-[calc(var(--logo-height)-30px)]" style="border-radius: 3px" />
    <div
      v-if="show"
      :class="[
        'ml-10px text-16px font-700',
        {
          'text-[var(--logo-title-text-color)]': layout === 'classic',
          'text-[var(--top-header-text-color)]': layout === 'topLeft' || layout === 'top' || layout === 'cutMenu'
        }
      ]">
      {{ title }}
    </div>
  </router-link>
</template>
