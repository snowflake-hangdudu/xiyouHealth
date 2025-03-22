import ExcelJS from 'exceljs'
import FileSaver from 'file-saver'
export default function exportCel(sheetName, headers, data, name = '导出表格') {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet(sheetName)
  //确定表头
  console.log(headers,'headers');
  worksheet.columns = headers.map((header) => ({
    header: header.label,
    key: header.value,
    width: header.width || 10,
    style: {
      alignment: {
        horizontal: 'center',
        vertical: 'middle'
      }
    }
  }))

    // 添加数据 
    data.forEach((rowData)  => { 
      worksheet.addRow(rowData);  
    }); 

 

  workbook.xlsx
    .writeBuffer()
    .then((buffer) => {
      let file = new Blob([buffer], { type: 'application/octet-stream' })
      FileSaver.saveAs(file, name + '.xlsx')
    })
    .catch((error) => console.log('Error writing excel export', error))
}
