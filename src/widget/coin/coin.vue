

<template>
  <div style="display: flex" :style="props.center ? 'justify-content: center;' : ''">
    <el-tooltip class="box-item" effect="dark" :content="`金币:${props.value ?? '0'}`"
      :disabled="((parseFloat(`${props.value}`) < 1e5) || noFold)" placement="top-start">
      <div :class="['gold-coin', isZero ? 'zero' : '']">
        <div class="biubiubiu" @click="start">
          <img class="coin-img" src="@/assets/imgs/gold_coin.png" />
        </div>
        <div style="margin-left: 2px;">{{ label }}</div>
      </div>
    </el-tooltip>
  </div>
</template>
<script lang="ts" setup>
import { delayDuration } from '@/utils/async';
import { computed } from 'vue';
import CoinIcon from '@/assets/imgs/gold_coin.png'

const props = defineProps<{
  value?: number | string,
  gray?: number | string,
  center?: boolean,
  noFold?: boolean,
}>()

const isZero = computed(() => {
  return props.value == '0' || !props.value || props.gray
})

const label = computed(() => {
  if (!props.value) return '0'
  let v = parseFloat(`${props.value}`);
  if (props.noFold) return `${v}`
  if (v >= 1e8) {
    if (v % 1e8 === 0) return `${Math.floor(v / 1e8)}亿`;
    return `${Math.floor(v / 1e8)}亿+`;
  }
  if (v >= 1e5) {
    if (v % 1e5 === 0) return `${Math.floor(v / 1e4)}万`;
    return `${Math.floor(v / 1e4)}万+`;
  }
  return `${v}`
})

let count = 0;
let lock = false;

async function start() {
  if (props.value == '0' || !props.value || props.gray) return;
  if (lock) return;
  if (count < 20) return count++;
  lock = true;
  console.log('===start!', isZero.value, lock, count)
  for (let i = 0; i < 100; i++) {
    snow();
    await delayDuration(60);
  }
  lock = false;
  count = 0;
}

//创建雪花元素
function snow() {
  //获取视窗的宽高
  var width = window.innerWidth;
  var height = window.innerHeight;

  var snow = document.createElement("div");             //创建元素

  //初始化雪花样式
  let size = Math.random() * 10 + 20;                          //随机生成雪花大小
  snow.style.width = size + "px";
  snow.style.height = size + "px";
  // snow.style.background = "url(img/雪花-0" + Math.floor((Math.random()*6)+1) + ".png) no-repeat";     //随机选择雪花的图片
  snow.style.background = `url(${CoinIcon}) no-repeat`;
  snow.style.backgroundSize = '100% 100%';
  snow.style.position = "fixed";                         //给图片设置高斯模糊
  snow.style.left = Math.random() * width + 'px';         //随机生成雪花的初始位置
  snow.style.top = "10px";
  snow.style.zIndex = '999';

  //向body添加元素
  document.body.appendChild(snow);

  //创建定时器，每30ms雪花下落一次
  var timer = setInterval(function () {
    snow.style.top = parseInt(snow.style.top) + 4 + 'px';     //每次下落8px

    //当雪花到达底部后清除元素
    if (parseInt(snow.style.top) >= height) {
      clearInterval(timer);
      snow.parentNode?.removeChild(snow)
    }
  }, 15)
}

</script>
<style lang="less" scoped>
.gold-coin.zero {
  filter: grayscale(100%);
}

.biubiubiu {
  flex-shrink: 0;
}

.coin-img {
  pointer-events: none;
  user-select: none;
}

.gold-coin {
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  color: #E99624;
  text-align: left;

  img {
    width: 20px;
    height: 20px;
  }
}
</style>