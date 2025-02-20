// 定义一个函数，接受一个文件夹路径作为参数
function scanVueFiles(folderPath) {
  // 引入fs模块，用于操作文件系统
  const fs = require('fs');
  // 读取文件夹下的所有文件名，返回一个数组
  const fileNames = fs.readdirSync(folderPath);
  // 遍历文件名数组
  for (let fileName of fileNames) {
    // 拼接文件路径
    const filePath = folderPath + '/' + fileName;
    // 判断文件路径是否是一个文件夹，如果是，则递归调用函数
    if (fs.statSync(filePath).isDirectory()) {
      scanVueFiles(filePath);
    }
    // 判断文件名是否以.vue结尾，如果是，则继续处理
    else if (fileName.endsWith('.vue')) {

      const results = [];
      // 读取文件内容，返回一个字符串
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      // 定义一个正则表达式，用于匹配const permission = usePermissionScope('xxxx')这样的语句
      const regex = /const permission = usePermissionScope\('(.*)'\)/;
      // 使用正则表达式在文件内容中查找匹配结果，返回一个数组或null
      const matchResult = fileContent.match(regex);
      // 判断匹配结果是否存在，如果存在，则继续处理
      if (matchResult) {
        // 获取匹配结果中的第一个括号内的内容，即xxxx部分
        const permissionScope = matchResult[1];
        // 打印权限范围和文件路径
        // console.log(permissionScope);
        results.push(permissionScope);
      } else {
        continue;
      }

      // 定义另一个正则表达式，用于匹配permission.has('xxx')这样的语句
      const regex2 = /permission\.[a-zA-Z]+\('(.*?)'\)/g;
      // 使用正则表达式在文件内容中查找所有匹配结果，返回一个数组或null
      const matchResult2 = fileContent.match(regex2);
      // 判断匹配结果是否存在，如果存在，则继续处理
      if (matchResult2) {
        // 遍历匹配结果数组
        for (let match of matchResult2) {
          // 获取匹配结果中的第一个括号内的内容，即xxx部分
          const permissionCheck = match.replace('hasSpecial', 'has').slice(16, -2);
          // 打印权限检查和文件路径
          // console.log(permissionCheck);
          results.push(permissionCheck);
        }
      }
      if (results.length) {
        // console.log(filePath);
        console.log([
          [...new Set(results)].map(e => ({
            'Add': '新增',
            'Delete': '删除',
            'Edit': '修改',
            'Detail': '详情',
          }[e] ?? e)).join(','),
          filePath
        ].join(' '));
      }
    }
  }
}

// 调用函数，传入当前文件夹路径
scanVueFiles('./src');
