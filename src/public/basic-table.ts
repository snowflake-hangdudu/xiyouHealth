import Queryable, { BasicQueryParams, PagedData } from './queryable'
import { onMounted, onUnmounted, reactive, ref, UnwrapNestedRefs } from 'vue'
import { ElNotification, ElMessageBox, messageType } from 'element-plus'
import { useAppStoreOutside } from '@/store/modules/app'
import { hashCode } from '@/utils/hashCode'
import { getDatabaseInstance } from '@/utils/dataBase'

class _TableDataCache {
  tableName = 'TableCacheData'
  dbInstance: IDBDatabase | undefined

  async initDB() {
    this.dbInstance = await getDatabaseInstance()
  }

  async get(key: string): Promise<any> {
    const hashKey = `${this.tableName}:` + hashCode(key)
    return new Promise(async (r, e) => {
      if (!this.dbInstance) {
        await this.initDB()
      }
      const transaction = this.dbInstance!.transaction([this.tableName])
      const objectStore = transaction.objectStore(this.tableName)
      const request = objectStore.get(hashKey)
      request.onsuccess = (event: Event) => {
        r((event.target as IDBRequest).result?.value)
      }
      request.onerror = (event: Event) => {
        console.error((event.target as IDBOpenDBRequest).error)
      }
    }).catch((e) => {
      console.error('_TableDataCache.get', e)
      return undefined
    })
  }
  async set(key: string, value: any): Promise<void> {
    const hashKey = `${this.tableName}:` + hashCode(key)

    return new Promise<void>(async (r, e) => {
      if (!this.dbInstance) {
        await this.initDB()
      }
      const transaction = this.dbInstance!.transaction([this.tableName], 'readwrite')
      const objectStore = transaction.objectStore(this.tableName)
      const request = objectStore.put({
        hashKey: hashKey,
        __rawKey: key,
        value: value
      })
      request.onsuccess = (event: Event) => {
        r()
      }
      request.onerror = (event: Event) => {
        console.error((event.target as IDBOpenDBRequest).error)
        e()
      }
    }).catch((e) => {
      console.error('_TableDataCache.set', e)
      return undefined
    })
  }
}

const globalTableDataCache = new _TableDataCache()

// refTable函数必须是同步的，所以依然使用sessionStorage
// const globalQueryCache = new TableDataCache("TableQueryCache");
const globalQueryCache = {
  get(key: string): any {
    return JSON.parse(sessionStorage.getItem('Table#Q:' + hashCode(key)) ?? '{}')?.value
  },
  set(key: string, value: any) {
    sessionStorage.setItem(
      'Table#Q:' + hashCode(key),
      JSON.stringify({
        __rawKey: key,
        value: value
      })
    )
  }
}

interface TableState<T, E extends BasicQueryParams, F extends Queryable<T, E>> {
  // 表格内容
  list: T[]
  total: number
  listLoading: boolean
  submitLoading: boolean
  query: E
  // 添加的Dialog
  addDialogVisible: boolean
  isNew: boolean
  // 增加使用的对象
  row: Partial<T>
  rules: { [P in keyof T]?: any }
  source: F
  __refKey: string
}

export type TableLifeCycleCallers = {
  onInit?: () => Promise<void> | undefined | void
  beforeQueryAll?: () => Promise<void> | undefined | void
  afterQueryAll?: () => Promise<void> | undefined | void
  beforeSubmit?: () => Promise<void> | undefined | void
  afterSubmit?: () => Promise<void> | undefined | void
  beforeDelete?: () => Promise<void> | undefined | void
  afterDelete?: () => Promise<void> | undefined | void
  beforeOpenDialog?: (isNew: boolean) => Promise<void> | undefined | void
  afterOpenDialog?: (isNew: boolean) => Promise<void> | undefined | void
}

class BasicTable<T, E extends BasicQueryParams, F extends Queryable<T, E>> {
  private _ref?: UnwrapNestedRefs<TableState<T, E, F>>

  private get v(): TableState<T, E, F> {
    return this._ref as TableState<T, E, F>
  }

  private get objName() {
    return this.v.source.objectName
  }

  private _lifeCycleCallers?: TableLifeCycleCallers

  /**
   * 使用数据源来创建一个table对象
   * 使用:
   * const [tb, actions] = refTable<UserModel, UserQueryParmas, UserQuery>(
   *   new UserQuery(),
   *   {
   *     // 查询参数
   *   }
   * );
   *
   * **注意：如果不提供查询参数
   * const [tb, actions] = refTable<UserModel, UserQueryParmas, UserQuery>(
   *   new UserQuery(),
   * );
   * 那么不会在onMount时触发source的all方法去请求列表
   */
  static refTable = function <T, E extends BasicQueryParams = any, F extends Queryable<T, E> = any>(
    data: F,
    queryParams?: E,
    lifeCycles?: TableLifeCycleCallers
  ): [UnwrapNestedRefs<TableState<T, E, F>>, BasicTable<T, E, F>] {
    const table = new BasicTable<T, E, F>()
    table._lifeCycleCallers = lifeCycles
    const userinfo = useAppStoreOutside().userInfo
    // 不直接用constructor.name是因为缓存的key对大小写不敏感，编译后会出现碰撞（a与A碰撞）
    const classHashKey = hashCode(
      data.constructor.name
        .split('')
        .map((e) => (e || ' ').charCodeAt(0))
        .join('')
    )
    const refKey = `__tableRef#${userinfo?.id}_${hashCode(window.location.href)}_${classHashKey}_${data.objectName}`

    let cache = globalQueryCache.get(refKey)
    if (!cache?.pageSize) cache = undefined // 无pagesize就不获取缓存
    const query = Object.assign(
      {
        pageNum: 1,
        pageSize: 5
      },
      cache ?? queryParams
    )

    console.log('init query', refKey, data.objectName, query)

    if (!!queryParams) {
      onMounted(async () => {
        data._valueGetter = () => table.v.row
        lifeCycles?.onInit?.()
        await table.queryAll()
      })
    }
    const finalConfig: TableState<T, E, F> = {
      list: [],
      total: 0,
      listLoading: false,
      submitLoading: false,
      query: query,
      addDialogVisible: false,
      isNew: false,
      row: {},
      rules: {},
      source: data,
      __refKey: refKey
    }

    const tableRef = reactive(finalConfig) as UnwrapNestedRefs<TableState<T, E, F>>
    table._ref = tableRef
    return [tableRef, table]
  }

  loaded = false

  // 查询
  async queryAll(args?: { resetPage: boolean }) {
    const userinfo = useAppStoreOutside().userInfo
    await this._lifeCycleCallers?.beforeQueryAll?.()
    const dataKey = `__tableData#${userinfo?.id}_${this.v.source.constructor.name}_${JSON.stringify(this.v.source)}_${JSON.stringify(this.v.query)}`
    this.v.listLoading = true
    if (!this.loaded) {
      let dataCache = await globalTableDataCache.get(dataKey)
      if (dataCache && this.v.query.pageNum == 1) {
        console.log('引用缓存:', dataKey, dataCache)
        this.v.listLoading = false
        if (dataCache.hasOwnProperty('total')) {
          dataCache = dataCache as PagedData<T>
          this.v.list = dataCache.data
          this.v.total = dataCache.total
        } else {
          this.v.list = dataCache as T[]
        }
      }
    }
    try {
      if (args?.resetPage === true) {
        this.v.query.pageNum = 1
      }
      let res = await this.v.source.all(this.v.query)
      if (!this.loaded) await globalTableDataCache.set(dataKey, res)
      this.loaded = true
      if (res.hasOwnProperty('total')) {
        res = res as PagedData<T>
        this.v.list = res.data
        this.v.total = res.total
      } else {
        this.v.list = res as T[]
      }
      await this._lifeCycleCallers?.afterQueryAll?.()
      console.log('查询数据:', this.v.list)
    } catch (error) {
      console.error(error)
      this.notifyError('查询失败', '查询数据时发生错误')
      this.v.listLoading = false
    }
    this.v.listLoading = false
    globalQueryCache.set(this.v.__refKey, this.v.query)
    return this.v.list
  }
  // 增加
  async add() {
    console.log('add', this)
    this.v.isNew = true
    this.v.row = Object.assign({}, this.v.source.defaultObject)
    this.v.rules = this.v.source.rules
    await this._lifeCycleCallers?.beforeOpenDialog?.(this.v.isNew)
    this.v.addDialogVisible = true
    await this._lifeCycleCallers?.afterOpenDialog?.(this.v.isNew)
  }
  // 编辑
  async edit(row: T) {
    console.log('edit', row)
    this.v.isNew = false
    this.v.row = Object.assign({}, row)
    this.v.rules = this.v.source.rules
    await this._lifeCycleCallers?.beforeOpenDialog?.(this.v.isNew)
    this.v.addDialogVisible = true
    await this._lifeCycleCallers?.afterOpenDialog?.(this.v.isNew)
  }
  // 提交（增加与修改）
  async submit(obj?: Partial<T>, forceIsNew?: boolean) {
    if (forceIsNew !== undefined) this.v.isNew = forceIsNew
    console.log('###submit', obj, this.v.isNew)
    if (obj?.['screenX'] && obj?.['screenY']) obj = undefined
    obj = Object.assign({}, obj || this.v.row)
    try {
      this.v.submitLoading = true
      if (this.v.isNew) {
        console.log('add')
        await this._lifeCycleCallers?.beforeSubmit?.()
        await this.v.source.add(obj)
        await this._lifeCycleCallers?.afterSubmit?.()
        this.notifySuccess('已新增', `成功新增${this.objName}`)
      } else {
        console.log('edit')
        await this._lifeCycleCallers?.beforeSubmit?.()
        await this.v.source.edit(obj)
        await this._lifeCycleCallers?.afterSubmit?.()
        this.notifySuccess('已提交', `${this.objName}修改成功`)
      }
      this.v.addDialogVisible = false
      await this.queryAll()
    } catch (error) {
      console.error(error)
      if (typeof error === 'string') {
        if (error !== '') this.notifyError('发生错误', error)
      } else {
        this.notifyError('发生错误', '操作发生错误，数据提交失败')
      }
    }
    this.v.submitLoading = false
  }
  /**
   * 进行一个操作，例如上下架/修改某个字段
   * 本函数方便在模板内书写
   **/
  async act(
    caller: () => Promise<any>,
    confirm?: { title?: string; msg?: string; action?: string; success?: string; fail?: string; type?: messageType }
  ) {
    try {
      if (confirm?.title || confirm?.msg || confirm?.action) {
        try {
          await ElMessageBox.confirm(confirm.msg ?? '确定要继续当前操作吗?', confirm.title ?? '提示', {
            confirmButtonText: confirm.action ?? '继续',
            cancelButtonText: '取消',
            type: confirm.type ?? 'info'
          })
        } catch (error) {
          console.error(error)
          return
        }
      }
      const res = await caller()
      this.notifySuccess('已完成操作', confirm?.success ?? `${this.objName}修改成功`)
      this.v.listLoading = true
      await this.queryAll()
      this.v.listLoading = false
      return res
    } catch (error) {
      console.error(error)
      if (typeof error === 'string') {
        if (error !== '') this.notifyError('失败', error)
        return
      }
      this.notifyError('失败', confirm?.fail ?? '操作发生错误，数据提交失败')
      this.v.listLoading = false
      throw error
    }
  }
  // 删除
  async deleteRow(row: T, disableConfirm?: boolean) {
    try {
      if (!disableConfirm) {
        try {
          await ElMessageBox.confirm('你正在进行删除操作，数据被删除后无法恢复，请确认删除此数据', '删除数据', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'error'
          })
        } catch (error) {
          console.error(error)
          return
        }
      }
      this.v.submitLoading = true
      await this._lifeCycleCallers?.beforeDelete?.()
      await this.v.source.deleteObj(row)
      await this._lifeCycleCallers?.afterDelete?.()
      this.notifySuccess('已删除', `${this.objName}已被删除`)
    } catch (error) {
      console.error(error)
      if (typeof error === 'string') {
        if (error !== '') this.notifyError('发生错误', error)
        return
      }
      this.notifyError('发生错误', '操作发生错误，数据提交失败')
    }
    this.v.submitLoading = false
    await this.queryAll()
  }

  get dialogTitle() {
    return (this.v.isNew ? '新增' : '修改') + this.objName
  }

  sizeChange(size: number) {
    this.v.query.pageNum = 1
    this.v.query.pageSize = size
    this.queryAll()
  }

  pageChange(page: number) {
    this.v.query.pageNum = page
    this.queryAll()
  }

  notifySuccess(title: string, msg: string) {
    ElNotification({
      title: title,
      message: msg,
      type: 'success'
    })
  }
  notifyError(title: string, msg: string) {
    ElNotification({
      title: title,
      message: msg,
      type: 'error'
    })
  }
}

export default BasicTable.refTable
