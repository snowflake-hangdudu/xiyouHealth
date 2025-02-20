<template>
  <el-cascader
    :class="class"
    :model-value="result"
    :options="regionForSelect"
    :props="casConfig"
    :disabled="props.disabled"
    :clearable="props.clearable"
    :placeholder="props.placeholder"
    filterable
    @change="handleChange" />
  <!-- {{ props.modelValue }} -->
  <!-- {{ result }} -->
</template>
<script lang="ts" setup>
import { computed } from '@vue/reactivity'
import { CascaderOption, CascaderProps } from 'element-plus'
import { RegionResult } from './data/data'
import { AreaForSelect } from '@/part-seller/pages/import-excel/packages/parse-address/src/parse/index.js'

const props = defineProps<{
  modelValue: RegionResult
  showAll?: boolean
  disabled?: boolean
  depth?: number
  clearable?: boolean
  placeholder?: string
  class?: string
}>()

const emit = defineEmits<{
  (event: 'update:model-value', value: RegionResult): void
  (event: 'change', value: RegionResult): void
}>()

interface RegionItem<T> {
  label: string
  value: string
  children?: T[]
}

const _depth = props.depth ?? 3
const _d2 = _depth >= 2
const _d3 = _depth >= 3

let regionForSelect: CascaderOption[] = AreaForSelect.map((e) => ({
  label: e.name,
  value: e.name,
  children: !_d2
    ? undefined
    : e.children?.map((e) => ({
        label: e.name,
        value: e.name,
        children: !_d3
          ? undefined
          : e.children?.map((e) => ({
              label: e,
              value: e
            }))
      }))
}))

const allMark = {
  label: '全部',
  value: '全部'
}

if (props.showAll)
  regionForSelect = [
    // allMark,
    ...regionForSelect.map((e) => ({
      label: e.label,
      value: e.value,
      children: !_d2
        ? undefined
        : [
            allMark,
            ...(e.children?.map((e) => ({
              label: e.label,
              value: e.value,
              children: !_d3
                ? undefined
                : [
                    allMark,
                    ...(e.children?.map((e) => ({
                      label: e.label,
                      value: e.value
                    })) ?? [])
                  ]
            })) ?? [])
          ]
    }))
  ]

const casConfig: CascaderProps = {
  expandTrigger: 'hover'
}

const result = computed<any>(() => {
  return [
    props.modelValue.province || '全部',
    !_d2 ? undefined : props.modelValue.city || '全部',
    !_d3 ? undefined : props.modelValue.area || '全部'
  ].filter((e) => !!e)
})

function handleChange(e: [string, string, string]) {
  emit(
    'update:model-value',
    Object.assign(props.modelValue, {
      province: e?.[0] == '全部' ? undefined : e?.[0],
      city: e?.[1] == '全部' ? undefined : e?.[1],
      area: e?.[2] == '全部' ? undefined : e?.[2]
    })
  )
  emit(
    'change',
    Object.assign(props.modelValue, {
      province: e?.[0] == '全部' ? undefined : e?.[0],
      city: e?.[1] == '全部' ? undefined : e?.[1],
      area: e?.[2] == '全部' ? undefined : e?.[2]
    })
  )
}
</script>
