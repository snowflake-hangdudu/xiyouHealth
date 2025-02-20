#!/bin/bash

echo "使用本地打包，打包将切到main然后，清空未提交修改，不存代码的后果自负..."
git checkout main
git reset --hard
git pull origin main
npm run build:prod
scp -r ./deploy/build/h5/* root@159.75.229.254:/root/sec_money_admin/deploy/upload/dist
echo "上传完成"
git checkout -

echo "远程部署中..."
ssh root@159.75.229.254 <<eeooff
  cd /root/sec_money_admin/
  mv /root/sec_money_admin/dist/ deploy/backup/BACKUP-$(date "+%Y_%m_%d@%H:%M:%S")
  mv -v /root/sec_money_admin/deploy/upload/dist /root/sec_money_admin/
  mkdir /root/sec_money_admin/deploy/upload/dist
eeooff
echo "已完成部署:"
echo "https://www.hsyxz.com/admin/#/"

exit 0
# fi

# echo "现在仅支持scp上传，使用bash deploy.sh scp"
