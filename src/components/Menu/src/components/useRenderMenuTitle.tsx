import type { RouteMeta } from 'vue-router'
import { Icon } from '@/components/Icon'
import { useI18n } from '@/hooks/web/useI18n'
import NoticeCount from '@/global/noticeCenter'
import ProgressTag from '@/global/routeTagCenter'
import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

const env = import.meta.env

const appStore = useAppStore()

const collapse = computed(() => appStore.getCollapse)

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (route: AppRouteRecordRaw, parentPath: string) => {
    // console.warn(collapse.value, parentPath);
    const meta = route.meta
    // const { t } = useI18n()
    const { title = '--', icon } = meta
    const count = NoticeCount[route.name]
    const tag = env.VITE_USER_NODE_ENV == 'production' ? [] : ProgressTag[route.name]
    var countStr = `${count}`
    const canExpand = (route.children?.filter((e) => !e.meta.hidden).length ?? 0) > 1
    if (count > 999) countStr = '999+'
    // const titleForDisplay = `${title}`.replace(/[（].+[）]/g, '')
    const titleForDisplay = title
    return icon ? (
      <>
        <Icon icon={meta.icon} class="biubiubiu"></Icon>
        {!(collapse.value && parentPath == '/') && (
          <div class="v-menu__title" style="display:flex;flex-grow:1;align-items:center">
            <div>{titleForDisplay}</div>
            <div style="display:flex;flex-grow:1"></div>
            {!!tag?.[0] && (
              <div class="notice-dot" style={`background: ${tag[1]}`}>
                {tag[0]}
              </div>
            )}
            {!!count && <div class="notice-dot">{countStr}</div>}
            {canExpand && <div style="width: 18px"></div>}
          </div>
        )}
      </>
    ) : (
      <span class="v-menu__title">{titleForDisplay}</span>
    )
  }

  return {
    renderMenuTitle
  }
}
