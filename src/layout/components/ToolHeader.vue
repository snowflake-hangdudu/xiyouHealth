<script lang="tsx">
import { defineComponent, computed } from 'vue'
import { Collapse } from '@/components/Collapse'
import { LocaleDropdown } from '@/components/LocaleDropdown'
import { SizeDropdown } from '@/components/SizeDropdown'
import { UserInfo } from '@/components/UserInfo'
import { Screenfull } from '@/components/Screenfull'
import { Breadcrumb } from '@/components/Breadcrumb'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { Close } from '@element-plus/icons-vue'
import { useCosplayMode } from '@/store/modules/cosplay'
import UserTagView from './UserTagView.vue'
import CourseView from './CourseView.vue'
import NoticeView from './NoticeView.vue'
import { useRouter } from 'vue-router'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tool-header')

const appStore = useAppStore()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)

// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)

// 尺寸图标
const size = computed(() => appStore.getSize)

// 布局
const layout = computed(() => appStore.getLayout)

// 多语言图标
const locale = computed(() => appStore.getLocale)

const message = computed(() => appStore.getSysNotice)

const cosplayMode = useCosplayMode()

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    const { push, currentRoute } = useRouter()
    console.log('push', push)
    const goBackToNavigation = () => {
      console.log('push', push)
      push('/transfer')
    }
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}>
        {layout.value !== 'top' ? (
          <div class="h-full flex items-center" style="flex-shrink: 0;display: flex;align-items: center">
            {hamburger.value && layout.value !== 'cutMenu' ? <Collapse color="var(--top-header-text-color)"></Collapse> : undefined}
            {breadcrumb.value ? <Breadcrumb class="<md:hidden "></Breadcrumb> : undefined}
          </div>
        ) : undefined}

        <div style="display:flex;align-items:center;flex:1;justify-content: center">
          <UserTagView></UserTagView>
          {/* <Text></Text> */}
          {!!message.value ? <NoticeView style="margin-left:8px" /> : undefined}
          {/* <div style='padding-right:6px'>{appStore.userInfo?.enterpriseName}</div>
          {cosplayMode.getIsCosplayMode && <div>
            <el-tooltip
              class="box-item"
              effect="dark"
              content="正在管理企业，点击返回管理员页面"
              placement="bottom"
            >
              <el-button type="primary" size="small" icon={<Close />} plain onClick={() => {
                cosplayMode.openCosplayMode([], {});
              }}>退出管理</el-button>
            </el-tooltip>
          </div>} */}
        </div>
        <div class="h-full flex items-center">
          <CourseView></CourseView>
          {screenfull.value ? <Screenfull class="hover-trigger" color="var(--top-header-text-color)"></Screenfull> : undefined}
          {size.value ? <SizeDropdown class="hover-trigger" color="var(--top-header-text-color)"></SizeDropdown> : undefined}
          {locale.value ? <LocaleDropdown class="hover-trigger" color="var(--top-header-text-color)"></LocaleDropdown> : undefined}
          <UserInfo class="hover-trigger"></UserInfo>
        </div>
      </div>
    )
  }
})
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-tool-header';

.@{prefix-cls} {
  transition: left var(--transition-time-02);
}
</style>
