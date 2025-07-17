---
title: '备忘录: libvirt qemu虚拟机硬盘 扩容'
pubDate: '2025-07-17'
---

## 1.扩容 qcow2 虚拟硬盘

在虚拟机宿主系统上  
进入虚拟机硬盘目录  
查看虚拟硬盘信息  
```bash
qemu-img info arch.qcow2
```

扩容 qcow2  
```bash
qemu-img resize arch.qcow2 +256G
```

## 2.启动客户虚拟机，扩容分区
查看分区  
```bash
df -hT
# output
#
# Filesystem     Type      Size  Used Avail Use% Mounted on
# dev            devtmpfs   32G     0   32G   0% /dev
# run            tmpfs      32G  1.3M   32G   1% /run
# efivarfs       efivarfs  256K  102K  150K  41% /sys/firmware/efi/efivars
# /dev/vda2      xfs       255G   56G  200G  22% /
# tmpfs          tmpfs      32G     0   32G   0% /dev/shm
# tmpfs          tmpfs     1.0M     0  1.0M   0% /run/credentials/systemd-journald.service
# tmpfs          tmpfs      32G   24K   32G   1% /tmp
# /dev/vda1      vfat     1022M  156M  867M  16% /boot
# tmpfs          tmpfs     6.3G   56K  6.3G   1% /run/user/1000
```

可以看到我们需要扩容的分区为`/dev/vda2`  

安装`cloud-guest-utils`  
```bash
# Debian/Ubuntu
apt install cloud-guest-utils

# Arch linux
pacman -S cloud-guest-utils
```

扩容分区  
```bash
❯ sudo growpart /dev/vda 2
# output
#
# CHANGED: partition=2 start=2099200 old: size=534769664 end=536868863 new: size=1071642591 end=1073741790
```

查看扩容结果  
```bash
lsblk
# output
#
# NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
# zram0  253:0    0    4G  0 disk [SWAP]
# vda    254:0    0  512G  0 disk
# ├─vda1 254:1    0    1G  0 part /boot
# └─vda2 254:2    0  511G  0 part /
```

## 3.扩容文件系统

由于使用的文件系统为xfs，所以我们使用xfs的工具为文件系统扩容   
```bash
sudo xfs_growfs /
# output
#
# meta-data=/dev/vda2              isize=512    agcount=4, agsize=16711552 blks
#          =                       sectsz=512   attr=2, projid32bit=1
#          =                       crc=1        finobt=1, sparse=1, rmapbt=1
#          =                       reflink=1    bigtime=1 inobtcount=1 nrext64=1
#          =                       exchange=0   metadir=0
# data     =                       bsize=4096   blocks=66846208, imaxpct=25
#          =                       sunit=0      swidth=0 blks
# naming   =version 2              bsize=4096   ascii-ci=0, ftype=1, parent=0
# log      =internal log           bsize=4096   blocks=32639, version=2
#          =                       sectsz=512   sunit=0 blks, lazy-count=1
# realtime =none                   extsz=4096   blocks=0, rtextents=0
#          =                       rgcount=0    rgsize=0 extents
#          =                       zoned=0      start=0 reserved=0
# data blocks changed from 66846208 to 133955323
```

查看扩容结果
```bash
df -hT
# output
#
# Filesystem     Type      Size  Used Avail Use% Mounted on
# dev            devtmpfs   32G     0   32G   0% /dev
# run            tmpfs      32G  1.3M   32G   1% /run
# efivarfs       efivarfs  256K  102K  150K  41% /sys/firmware/efi/efivars
# /dev/vda2      xfs       511G   61G  451G  12% /
# tmpfs          tmpfs      32G     0   32G   0% /dev/shm
# tmpfs          tmpfs     1.0M     0  1.0M   0% /run/credentials/systemd-journald.service
# tmpfs          tmpfs      32G   24K   32G   1% /tmp
# /dev/vda1      vfat     1022M  156M  867M  16% /boot
# tmpfs          tmpfs     6.3G   56K  6.3G   1% /run/user/1000
```

## 4. 使用LVM的客户系统
使用LVM的客户系统不适用上文描述的过程  
