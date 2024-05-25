---
title: '备忘录: SLAAC模式下固定ipv6 suffix'
pubDate: '2024-05-25'
---

## ifupdown
Debian系统最小安装默认使用ifupdown，可修改`/etc/network/interfaces`如下所示:
```
allow-hotplug eth0
iface eth0 inet dhcp
    pre-up /usr/sbin/sysctl -p
    pre-up /usr/sbin/ip -6 token set ::1/64 dev eth0
```

## Network manager
使用Network manager的系统可使用nmcli进行修改:
```bash
nmcli con modify WLAN ipv6.ip6-privacy 0 ipv6.addr-gen-mode eui64
nmcli con modify WLAN ipv6.token ::1
```
其中`WLAN`为network manager中connection的名字, 可使用以下命令查询:
```bash
nmcli conn show
```
