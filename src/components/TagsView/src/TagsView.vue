<script setup lang="ts">
import { onMounted, watch, computed, unref, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import type { RouteLocationNormalizedLoaded, RouterLinkProps } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { useI18n } from '@/hooks/web/useI18n'
import { filterAffixTags } from './helper'
import { ContextMenu, ContextMenuExpose } from '@/components/ContextMenu'
import { useDesign } from '@/hooks/web/useDesign'
import { useTemplateRefsList } from '@vueuse/core'
import { ElMessage, ElScrollbar } from 'element-plus'
import { useScrollTo } from '@/hooks/event/useScrollTo'
import AntIcon from '@/assets/icons'
import { updateNoticeCenter } from '@/global/noticeCenter'
import { readParamsObject } from '@/utils/params'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('tags-view')

const { t } = useI18n()

const { currentRoute, push, replace } = useRouter()

const permissionStore = usePermissionStore()

const routers = computed(() => permissionStore.getRouters)

const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.getVisitedViews)

const affixTagArr = ref<RouteLocationNormalizedLoaded[]>([])

const appStore = useAppStore()

const tagsViewIcon = computed(() => appStore.getTagsViewIcon)

// 初始化tag
const initTags = () => {
  affixTagArr.value = filterAffixTags(unref(routers))
  for (const tag of unref(affixTagArr)) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}

const selectedTag = ref<RouteLocationNormalizedLoaded>()

// 新增tag
const addTags = () => {
  const { name } = unref(currentRoute)
  if (name) {
    selectedTag.value = unref(currentRoute)
    tagsViewStore.addView(unref(currentRoute))
  }
  return false
}

// 关闭选中的tag
const closeSelectedTag = (view: RouteLocationNormalizedLoaded) => {
  if (view?.meta?.affix) return
  tagsViewStore.delView(view)
  if (isActive(view)) {
    toLastView()
  }
}

// 关闭全部
const closeAllTags = () => {
  tagsViewStore.delAllViews()
  toLastView()
}

// 关闭其他
const closeOthersTags = () => {
  tagsViewStore.delOthersViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 重新加载
const refreshSelectedTag = async (view?: RouteLocationNormalizedLoaded) => {
  if (!view) return
  tagsViewStore.delCachedView()
  const { path, query } = view
  await nextTick()
  // 现在固定从路径上读取query，以贴合常见的刷新效果，不再恢复路径不可见的参数。
  // 如果要恢复vue的query参数，使用query: query,
  replace({
    path: '/redirect' + path,
    query: readParamsObject() // 从路径中读取
  })
}

// 关闭左侧
const closeLeftTags = () => {
  tagsViewStore.delLeftViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 关闭右侧
const closeRightTags = () => {
  tagsViewStore.delRightViews(unref(selectedTag) as RouteLocationNormalizedLoaded)
}

// 跳转到最后一个
const toLastView = () => {
  const visitedViews = tagsViewStore.getVisitedViews
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    push(latestView)
  } else {
    if (
      unref(currentRoute).path === permissionStore.getAddRouters[0].path ||
      unref(currentRoute).path === permissionStore.getAddRouters[0].redirect
    ) {
      addTags()
      return
    }
    // You can set another route
    push(permissionStore.getAddRouters[0].path)
  }
}

// 滚动到选中的tag
const moveToCurrentTag = async () => {
  await nextTick()
  for (const v of unref(visitedViews)) {
    if (v.fullPath === unref(currentRoute).path) {
      moveToTarget(v)
      if (v.fullPath !== unref(currentRoute).fullPath) {
        tagsViewStore.updateVisitedView(unref(currentRoute))
      }

      break
    }
  }
}

const tagLinksRefs = useTemplateRefsList<RouterLinkProps>()

const moveToTarget = (currentTag: RouteLocationNormalizedLoaded) => {
  const wrap$ = unref(scrollbarRef)?.wrap$
  let firstTag: Nullable<RouterLinkProps> = null
  let lastTag: Nullable<RouterLinkProps> = null

  const tagList = unref(tagLinksRefs)
  // find first tag and last tag
  if (tagList.length > 0) {
    firstTag = tagList[0]
    lastTag = tagList[tagList.length - 1]
  }
  if ((firstTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 直接滚动到0的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: 0,
      duration: 500
    })
    start()
  } else if ((lastTag?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath) {
    // 滚动到最后的位置
    const { start } = useScrollTo({
      el: wrap$!,
      position: 'scrollLeft',
      to: wrap$!.scrollWidth - wrap$!.offsetWidth,
      duration: 500
    })
    start()
  } else {
    // find preTag and nextTag
    const currentIndex: number = tagList.findIndex((item) => (item?.to as RouteLocationNormalizedLoaded).fullPath === currentTag.fullPath)
    const tgsRefs = document.getElementsByClassName(`${prefixCls}__item`)

    const prevTag = tgsRefs[currentIndex - 1] as HTMLElement
    const nextTag = tgsRefs[currentIndex + 1] as HTMLElement

    // the tag's offsetLeft after of nextTag
    const afterNextTagOffsetLeft = nextTag.offsetLeft + nextTag.offsetWidth + 4

    // the tag's offsetLeft before of prevTag
    const beforePrevTagOffsetLeft = prevTag.offsetLeft - 4

    if (afterNextTagOffsetLeft > unref(scrollLeftNumber) + wrap$!.offsetWidth) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: afterNextTagOffsetLeft - wrap$!.offsetWidth,
        duration: 500
      })
      start()
    } else if (beforePrevTagOffsetLeft < unref(scrollLeftNumber)) {
      const { start } = useScrollTo({
        el: wrap$!,
        position: 'scrollLeft',
        to: beforePrevTagOffsetLeft,
        duration: 500
      })
      start()
    }
  }
}

// 是否是当前tag
const isActive = (route: RouteLocationNormalizedLoaded): boolean => {
  return route.path === unref(currentRoute).path
}

// 所有右键菜单组件的元素
const itemRefs = useTemplateRefsList<ComponentRef<typeof ContextMenu & ContextMenuExpose>>()

// 右键菜单装填改变的时候
const visibleChange = (visible: boolean, tagItem: RouteLocationNormalizedLoaded) => {
  if (visible) {
    for (const v of unref(itemRefs)) {
      const elDropdownMenuRef = v.elDropdownMenuRef
      if (tagItem.fullPath !== v.tagItem.fullPath) {
        elDropdownMenuRef?.handleClose()
      }
    }
  }
}

// elscroll 实例
const scrollbarRef = ref<ComponentRef<typeof ElScrollbar>>()

// 保存滚动位置
const scrollLeftNumber = ref(0)

const scroll = ({ scrollLeft }) => {
  scrollLeftNumber.value = scrollLeft as number
}

// 移动到某个位置
const move = (to: number) => {
  const wrap$ = unref(scrollbarRef)?.wrap$
  const { start } = useScrollTo({
    el: wrap$!,
    position: 'scrollLeft',
    to: unref(scrollLeftNumber) + to,
    duration: 500
  })
  start()
}

onMounted(() => {
  initTags()
  addTags()
})

watch(
  () => currentRoute.value,
  () => {
    addTags()
    moveToCurrentTag()
  }
)

function setWatchUnread(disabled: boolean) {
  ElMessage.success(disabled ? '已停止监听未读数' : '开始监听未读数变化')
  appStore.setDisableAutoUnread(disabled)
  updateNoticeCenter()
}
</script>

<template>
  <div :id="prefixCls" :class="prefixCls" class="flex w-full relative bg-[#fff] dark:bg-[var(--el-bg-color)]">
    <span
      :class="`${prefixCls}__tool tapped`"
      v-if="!appStore.disableAutoUnread"
      class="text-center leading-[var(--tags-view-height)] cursor-pointer"
      style="padding: 0px 12px; display: flex; align-items: center"
      @click="setWatchUnread(true)">
      <Icon :icon="AntIcon.bell" :color="appStore.getIsDark ? 'var(--el-text-color-regular)' : '#333'" />
      <!-- <span style="font-size: 12px;padding-left: 4px;">监听未读中</span> -->
    </span>
    <span
      :class="`${prefixCls}__tool tapped`"
      v-else
      class="text-center leading-[var(--tags-view-height)] cursor-pointer"
      style="padding: 0px 12px; display: flex; align-items: center"
      @click="setWatchUnread(false)">
      <Icon :icon="AntIcon.stop" :color="appStore.getIsDark ? 'var(--el-text-color-regular)' : '#333'" />
      <!-- <span style="font-size: 12px;padding-left: 4px;">已停止</span> -->
    </span>
    <span
      :class="`${prefixCls}__tool`"
      class="h-[var(--tags-view-height)] text-center leading-[var(--tags-view-height)] cursor-pointer back-btn"
      @click="$router.go(-1)">
      <Icon :icon="AntIcon.left" :color="appStore.getIsDark ? 'var(--el-text-color-regular)' : '#333'" />
      <span>返回</span>
    </span>
    <div class="overflow-hidden flex-1">
      <ElScrollbar ref="scrollbarRef" class="h-full" @scroll="scroll">
        <div class="flex h-full">
          <ContextMenu
            :ref="itemRefs.set"
            :schema="[
              {
                icon: 'ant-design:sync-outlined',
                label: t('common.reload'),
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  refreshSelectedTag(item)
                }
              },
              {
                icon: 'ant-design:close-outlined',
                label: t('common.closeTab'),
                disabled: !!visitedViews?.length && selectedTag?.meta.affix,
                command: () => {
                  closeSelectedTag(item)
                }
              },
              {
                divided: true,
                icon: 'ant-design:vertical-right-outlined',
                label: t('common.closeTheLeftTab'),
                disabled: !!visitedViews?.length && (item.fullPath === visitedViews[0].fullPath || selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeLeftTags()
                }
              },
              {
                icon: 'ant-design:vertical-left-outlined',
                label: t('common.closeTheRightTab'),
                disabled:
                  !!visitedViews?.length &&
                  (item.fullPath === visitedViews[visitedViews.length - 1].fullPath || selectedTag?.fullPath !== item.fullPath),
                command: () => {
                  closeRightTags()
                }
              },
              {
                divided: true,
                icon: 'ant-design:tag-outlined',
                label: t('common.closeOther'),
                disabled: selectedTag?.fullPath !== item.fullPath,
                command: () => {
                  closeOthersTags()
                }
              },
              {
                icon: 'ant-design:line-outlined',
                label: t('common.closeAll'),
                command: () => {
                  closeAllTags()
                }
              }
            ]"
            v-for="item in visitedViews"
            :key="item.fullPath"
            :tag-item="item"
            :class="[`${prefixCls}__item`, item?.meta?.affix ? `${prefixCls}__item--affix` : '', { 'is-active': isActive(item) }]"
            @visible-change="visibleChange">
            <div>
              <router-link :ref="tagLinksRefs.set" :to="{ ...item }" custom v-slot="{ navigate }">
                <div @click="navigate" class="h-full flex justify-center items-center whitespace-nowrap pl-15px">
                  <!-- <Icon v-if="
                                                                              item?.matched?.[1]?.meta?.icon && item?.matched?.[1]?.meta?.icon != AntIcon.holder &&
                                                                              tagsViewIcon
                                                                            " :icon="item?.matched[1]?.meta?.icon" :size="12" class="mr-5px" /> -->
                  {{ t(item?.meta?.title as string) }}
                  <Icon
                    :class="`${prefixCls}__item--close`"
                    color="#333"
                    icon="ant-design:close-outlined"
                    :size="12"
                    @click.prevent.stop="closeSelectedTag(item)" />
                </div>
              </router-link>
            </div>
          </ContextMenu>
        </div>
      </ElScrollbar>
    </div>
    <span
      :class="`${prefixCls}__tool`"
      class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] text-center leading-[var(--tags-view-height)] cursor-pointer"
      @click="refreshSelectedTag(selectedTag)">
      <Icon icon="ant-design:reload-outlined" :color="appStore.getIsDark ? 'var(--el-text-color-regular)' : '#333'" />
    </span>
    <ContextMenu
      trigger="click"
      :schema="[
        {
          icon: 'ant-design:sync-outlined',
          label: t('common.reload'),
          command: () => {
            refreshSelectedTag(selectedTag)
          }
        },
        {
          icon: 'ant-design:close-outlined',
          label: t('common.closeTab'),
          disabled: !!visitedViews?.length && selectedTag?.meta.affix
        },
        {
          divided: true,
          icon: 'ant-design:vertical-right-outlined',
          label: t('common.closeTheLeftTab'),
          disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[0].fullPath,
          command: () => {
            closeLeftTags()
          }
        },
        {
          icon: 'ant-design:vertical-left-outlined',
          label: t('common.closeTheRightTab'),
          disabled: !!visitedViews?.length && selectedTag?.fullPath === visitedViews[visitedViews.length - 1].fullPath,
          command: () => {
            closeRightTags()
          }
        },
        {
          divided: true,
          icon: 'ant-design:tag-outlined',
          label: t('common.closeOther'),
          command: () => {
            closeOthersTags()
          }
        },
        {
          icon: 'ant-design:line-outlined',
          label: t('common.closeAll'),
          command: () => {
            closeAllTags()
          }
        }
      ]">
      <span
        :class="`${prefixCls}__tool`"
        class="w-[var(--tags-view-height)] h-[var(--tags-view-height)] text-center leading-[var(--tags-view-height)] cursor-pointer block">
        <Icon icon="ant-design:setting-outlined" :color="appStore.getIsDark ? 'var(--el-text-color-regular)' : '#333'" />
      </span>
    </ContextMenu>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-tags-view';

.back-btn {
  padding: 2px 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
}

.back-btn:active {
  opacity: 0.5;
}

.@{prefix-cls} {
  :deep(.@{elNamespace}-scrollbar__view) {
    height: 100%;
  }

  &__tool {
    position: relative;

    &:hover {
      :deep(span) {
        color: var(--el-color-black) !important;
      }
    }

    &:after {
      position: absolute;
      top: 1px;
      left: 0;
      width: 100%;
      height: calc(~'100% - 1px');
      border-right: 1px solid var(--tags-view-border-color);
      border-left: 1px solid var(--tags-view-border-color);
      content: '';
    }
  }

  &__item {
    position: relative;
    top: 2px;
    height: calc(~'100% - 4px');
    padding-right: 25px;
    margin-left: 4px;
    font-size: 12px;
    cursor: pointer;
    border: 1px solid #d9d9d9;

    &--close {
      position: absolute;
      top: 50%;
      right: 5px;
      display: none;
      transform: translate(0, -50%);
    }

    &:not(.@{prefix-cls}__item--affix):hover {
      .@{prefix-cls}__item--close {
        display: block;
      }
    }
  }

  &__item:not(.is-active) {
    &:hover {
      color: var(--el-color-primary);
    }
  }

  &__item.is-active {
    color: var(--el-color-white);
    background-color: var(--el-color-primary);
    border: 1px solid var(--el-color-primary);

    .@{prefix-cls}__item--close {
      :deep(span) {
        color: var(--el-color-white) !important;
      }
    }
  }
}

.dark {
  .@{prefix-cls} {
    &__tool {
      &:hover {
        :deep(span) {
          color: #fff !important;
        }
      }

      &:after {
        border-right: 1px solid var(--el-border-color);
        border-left: 1px solid var(--el-border-color);
      }
    }

    &__item {
      position: relative;
      top: 2px;
      height: calc(~'100% - 4px');
      padding-right: 25px;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid var(--el-border-color);
    }

    &__item:not(.is-active) {
      &:hover {
        color: var(--el-color-primary);
      }
    }

    &__item.is-active {
      color: var(--el-color-white);
      background-color: var(--el-color-primary);

      .@{prefix-cls}__item--close {
        :deep(span) {
          color: var(--el-color-white) !important;
        }
      }
    }
  }
}
</style>
