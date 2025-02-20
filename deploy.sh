#!/bin/bash

echo "使用本地打包..."

if [[ $1 =~ "pull" ]]
  then
git pull origin sit
fi

npm run build:sit
scp -r ./distBuild/* root@49.232.195.143:/root/yb-tooth-admin/distBuild/
echo "上传完成"
open 'https://test.ybhospital.net/yb-tooth-admin/#/'
exit 0