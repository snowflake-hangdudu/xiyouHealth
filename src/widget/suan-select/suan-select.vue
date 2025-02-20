<template>
  <el-select
    :model-value="textValue"
    @update:model-value="(v) => emit('update:model-value', v)"
    @change="(v) => emit('change', v)"
    remote
    :remote-method="onRemote"
    filterable
    :disabled="disabled || tb.listLoading"
    :clearable="clearable"
    :loading="remoteLoading"
    :placeholder="placeholder ?? '请输入搜索'">
    <el-option
      v-for="item in data"
      :key="`${build(item).key ?? item.id}`"
      :label="build(item).label ?? item.id"
      :value="build(item).value ?? item.id ?? ''"
      :disabled="build(item).disabled"></el-option>
  </el-select>
</template>
<script setup lang="ts">
import refTable from '@/public/basic-table'
import Queryable, { BasicQueryParams } from '@/public/queryable'
import { computed, onMounted, ref } from 'vue'

type SelectValue = string | number | boolean | Record<string, any> | unknown[]

const textValue = computed(() => {
  if (!props.modelValue) return ''
  return build(idMap.value.get(props.modelValue)).label ?? props.modelValue ?? ''
})

function build(item) {
  if (!item) return {}
  return props.builder(item)
}

const props = defineProps<{
  modelValue?: SelectValue
  placeholder?: string
  disabled?: boolean
  lazy?: boolean
  clearable?: boolean
  source: Queryable<any, BasicQueryParams>
  params: Record<string, string | number | unknown[]>
  builder: (data: any) => {
    key?: string | number
    label?: string
    value?: string | number | boolean | Record<string, any>
    disabled?: boolean
  }
}>()

const emit = defineEmits<{
  (event: 'update:model-value', value: SelectValue): void
  (event: 'change', value: SelectValue): void
}>()

let params: any = Object.assign({ pageSize: 0 }, props.params ?? {})
if (props.lazy) params = undefined

const [tb, actions] = refTable(props.source, params, {
  afterQueryAll() {
    if (!props.lazy) data.value = tb.list
  }
})

const idMap = computed(() => {
  return new Map(tb.list.map((e: any) => [e.id, e]))
})

const data = ref<any[]>([])

const remoteLoading = ref(false)

async function onRemote(str: string) {
  if (props.lazy) {
    if (!str) {
      data.value = []
      return
    }
    remoteLoading.value = true
    var res = await props.source?.all({ pageSize: 0, pageNum: 1, searchString: str })
    remoteLoading.value = false
    data.value = ((res as any).data ?? res) as any[]
  } else {
    data.value = tb.list.filter((e) => {
      const name = props.builder(e).label
      if (!name) return false
      return ~name.replace(/\s/g, '').indexOf(str.replace(/\s/g, ''))
    })
  }
}
</script>
