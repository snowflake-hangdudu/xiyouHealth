<template>
  <div class="analysis-page">
    <div class="analysis-page-left">
      <div class="home-user-info">
        <img class="avatar biubiubiu" src="@/assets/imgs/people.webp" />
        <div class="user">
          <div class="name">欢迎回来，{{ userinfo?.name }}</div>
          <div class="desc">{{ chickenSoup }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useAppStore, useAppStoreOutside } from '@/store/modules/app'
import { qiniuUrl } from '@/config/qiniu'

const chickenSoup = [
  '你的价值不是由别人决定的，而是由你自己认识的。相信你自己，你就能发现你的潜能。',
  '你的成长不是由时间决定的，而是由经历决定的。珍惜你的每一次经验，你就能收获你的成熟。',
  '你的快乐不是由物质决定的，而是由心态决定的。调整你的心情，你就能享受你的生活。',
  '你的成功不是由天赋决定的，而是由努力决定的。付出你的汗水，你就能实现你的目标。',
  '你的智慧不是由学历决定的，而是由阅读决定的。多读一些书，你就能开拓你的视野。',
  '你的魅力不是由外表决定的，而是由内涵决定的。丰富你的知识，你就能提升你的气质。',
  '你的友情不是由数量决定的，而是由质量决定的。真诚地对待你的朋友，你就能得到你的信赖。',
  '你的健康不是由年龄决定的，而是由习惯决定的。养成一个良好的生活习惯，你就能拥有一个强壮的身体。',
  '你的财富不是由金钱决定的，而是由价值决定的。创造更多的社会价值，你就能获得更多的经济回报。',
  '你的影响力不是由地位决定的，而是由贡献决定的。做出更多的社会贡献，你就能拥有更多的社会认可。',
  '你的幸福不是由条件决定的，而是由选择决定的。做出更好的生活选择，你就能拥有更好的生活品质。',
  '你的人生不是由命运决定的，而是由行动决定的。勇敢地追求你的梦想，你就能掌握你的人生方向。',
  '你的未来不是由过去决定的，而是由现在决定的。把握你的每一次机会，你就能创造你的未来可能。',
  '你的信念不是由言语决定的，而是由行为决定的。用你的行动证明你的信念，你就能赢得你的尊重。',
  '你的能力不是由天生决定的，而是由学习决定的。不断地学习新的知识和技能，你就能提高你的能力水平。',
  '你的品格不是由环境决定的，而是由修养决定的。不断地提升你的道德和素养，你就能塑造你的品格风范。',
  '你的自信不是由他人决定的，而是由自己决定的。不断地肯定你自己的优点和长处，你就能增强你的自信心。',
  '你的幸运不是由机缘决定的，而是由准备决定的。不断地做好你的准备工作，你就能抓住你的幸运机会。',
  '你的进步不是由速度决定的，而是由方向决定的。不断地确定你的目标和方向，你就能取得你的进步成果。',
  '你的人生不是由别人评价的，而是由你自己评价的。不断地审视你自己的人生态度和人生价值，你就能活出你自己的人生意义。'
][Math.floor(Math.random() * 20)]

const appStore = useAppStoreOutside()

const userinfo = computed(() => {
  return appStore.getUserInfo
})
</script>
<style lang="less" scoped>
.analysis-page {
  display: flex;
  flex-grow: 1;
  width: 100%;
  .analysis-page-left {
    width: 600px;
    flex-grow: 4;

    .home-user-info {
      // border: 1px solid rgba(155, 155, 155, 0.1);
      border-radius: 6px;
      margin: 0 12px;
      margin-bottom: 10px;
      padding: 12px 16px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .avatar {
        border-radius: 999px;
        height: 40px;
        width: 40px;
      }
      .user {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 12px;
        .name {
          font-size: 16px;
          font-weight: bold;
        }
        .desc {
          font-size: 14px;
          opacity: 0.6;
        }
      }
    }
  }
}
</style>
