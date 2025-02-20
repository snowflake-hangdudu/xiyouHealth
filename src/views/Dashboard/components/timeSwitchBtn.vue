<template>
  <div class="time-group" v-if="!props.border">
    <div :class="'time-btn ' + `${currentTagName == text ? 'select' : ''}`" v-for="text in props.tags" :key="text" @click="selectTag(text)">
      {{ text }}
    </div>
  </div>
  <el-radio-group v-if="props.border" :model-value="currentTagName" @update:model-value="(value) => selectTag(`${value}`)" size="small">
    <el-radio-button v-for="text in props.tags" :key="text" :label="text" />
  </el-radio-group>
</template>
<script setup lang="ts">
import DateRangeBuilder from '@/views/Dashboard/tools/dateRange'
import { computed } from 'vue'

type RangeName = '今日' | '昨日' | '7日' | '14日' | '30日' | '60日' | '90日'

const props = defineProps<{
  modelValue: [Date?, Date?]
  tags?: RangeName[]
  border?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', range: [Date, Date]): void
  (e: 'change', range: [Date, Date], text: string): void
}>()

function selectTag(name: string) {
  var result: [Date, Date] = DateRangeBuilder.today()
  if (name == '今日') result = DateRangeBuilder.today()
  if (name == '昨日') result = DateRangeBuilder.yesterday()
  if (name == '7日') result = DateRangeBuilder.last7()
  if (name == '14日') result = DateRangeBuilder.last14()
  if (name == '30日') result = DateRangeBuilder.last30()
  if (name == '60日') result = DateRangeBuilder.last60()
  if (name == '90日') result = DateRangeBuilder.last90()
  emit('update:modelValue', result)
  emit('change', result, name)
}

// eslint-disable-next-line vue/return-in-computed-property
const currentTagName = computed(() => {
  const dateRage = props.modelValue
  if (_eq(dateRage, DateRangeBuilder.today())) {
    return '今日'
  }
  if (_eq(dateRage, DateRangeBuilder.yesterday())) {
    return '昨日'
  }
  if (_eq(dateRage, DateRangeBuilder.last7())) {
    return '7日'
  }
  if (_eq(dateRage, DateRangeBuilder.last14())) {
    return '14日'
  }
  if (_eq(dateRage, DateRangeBuilder.last30())) {
    return '30日'
  }
  if (_eq(dateRage, DateRangeBuilder.last60())) {
    return '60日'
  }
  if (_eq(dateRage, DateRangeBuilder.last90())) {
    return '90日'
  }
})

function _eq(range1: [Date?, Date?], range2: [Date?, Date?]) {
  return range1[0]?.getTime() == range2[0]?.getTime() && range1[1]?.getTime() == range2[1]?.getTime()
}
</script>
<style lang="less" scoped>
.time-group {
  display: flex;
  padding: 0 6px;
  .time-btn {
    padding: 4px 6px;
    font-size: 12px;
    color: #9b9b9b;
    font-weight: normal;
  }
  .time-btn.select {
    color: var(--sec-orange);
  }

  .time-btn:hover {
    color: var(--sec-orange);
  }
  .time-btn:active {
    opacity: 0.5;
  }
}
</style>
