---
title: '备忘录: 使用zram-generator配置zram'
pubDate: '2024-11-11'
---

由于Debian默认安装后是不会启用zram的，所以需要安装完成后手动的开启  
本文以Debian为例，其他系统除软件包管理器命令以及软件包名字有所差异外，systemd配置部分应该别无二致  

## 安装软件包
``` bash
apt install systemd-zram-generator
```

## 配置zram-generator
创建zram-generator配置文件  
```
nano /etc/systemd/zram-generator.conf
```
填入配置  
```
[zram0]
zram-size = min(ram / 2, 4096)
compression-algorithm = zstd
```
zram大小为内存的二分之一，最大4096MiB

## 启动zram
``` bash
systemctl daemon-reload
systemctl start systemd-zram-setup@zram0.service
```
