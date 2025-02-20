import { computed } from 'vue'

export type SplitedTableItem<T, E> = Partial<T & { _child: E }>

/**
 *
 * @param rawList 原始的数组
 * @param childKey 子对象数组的字段名称
 * @param columnIndexList 不需要合并的列数（子对象所在列）
 * @returns
 */
export function useSplitTable<T, E>(builder: () => { rawList: T[]; childKey: string; columnIndexList: number[] }) {
  var splited = computed(() => {
    const { rawList, childKey, columnIndexList } = builder()
    const newList: SplitedTableItem<T, E>[] = []
    const key = childKey
    const spanMap = new Map<number, number>()
    for (const _index in rawList) {
      const index = Number(_index)
      const row = rawList[index]
      const list = row[key]
      const initIndex = newList.length
      if (list instanceof Array) {
        const _child = {}
        const childRow = Object.assign({}, row)
        // delete childRow[key]
        for (const child of list) {
          for (const childKey of Object.keys(child)) {
            _child[`${childKey}`] = child[childKey]
          }
          childRow['_child'] = Object.assign({}, _child)
          newList.push(Object.assign({}, childRow))
        }
        if (!list.length) {
          spanMap.set(index, (spanMap.get(index) ?? 0) + 1)
        }
        spanMap.set(initIndex, list.length)
      } else {
        // throw '数组中未能找到' + childKey;
        console.warn('数组中未能找到' + childKey)
      }
    }
    var spanMethods = (spanData: any) => {
      const { row, column, rowIndex, columnIndex } = spanData
      if (!~columnIndexList.indexOf(columnIndex))
        return {
          rowspan: spanMap.get(rowIndex) ?? 0,
          colspan: 1
        }
      return {
        rowspan: 1,
        colspan: 1
      }
    }
    return {
      list: newList,
      methods: spanMethods
    }
  })
  return splited
}
