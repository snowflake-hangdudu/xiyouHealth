/** bold转file */
export function blobToFile(blob, fileName: string) {
  blob.lastModified = Date.now()
  blob.lastModifiedDate = new Date()
  blob.name = fileName
  return blob
}