let __databaseInstance: IDBDatabase | undefined

export async function getDatabaseInstance() {
  if (__databaseInstance) return __databaseInstance
  return new Promise<IDBDatabase>((r, e) => {
    const request = indexedDB.open('HSYXZ_DB', 3)
    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      __databaseInstance = (event.target as IDBOpenDBRequest).result
      __databaseInstance?.createObjectStore('TableCacheData', { keyPath: 'hashKey' })
      const performanceStore = __databaseInstance?.createObjectStore('RequestPerformance', { keyPath: 'hashKey' })
      performanceStore.createIndex('date', 'date', { unique: false })
    }
    request.onsuccess = (event: any) => {
      __databaseInstance = event.target?.result
      r(__databaseInstance!)
    }
    request.onerror = (event: any) => {
      console.error('__databaseInstance', event.target?.error)
      __databaseInstance = undefined
      e()
    }
  }).catch((e) => {
    console.log('getDatabaseInstance', e)
    deleteDatabaseInstance()
    return __databaseInstance!
  })
}

export function deleteDatabaseInstance() {
  __databaseInstance?.close()
  __databaseInstance = undefined
  indexedDB.deleteDatabase('HSYXZ_DB')
}
