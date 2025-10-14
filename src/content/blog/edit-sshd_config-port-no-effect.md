---
title: '备忘录: 更改/etc/ssh/sshd_config端口不生效的解决方法'
pubDate: '2025-10-14'
---

## 问题
今天买了一个新VPS，开心的登录上去修改ssh端口，修改了/etc/ssh/sshd_config内的Port后重启ssh server，但是没有生效，依旧监听22端口。

## 研究
看一下ssh服务的状态
```bash
systemctl status ssh

● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/lib/systemd/system/ssh.service; enabled; preset: enabled)
     Active: active (running) since Tue 2025-10-14 03:39:33 EDT; 9s ago
TriggeredBy: ● ssh.socket
       Docs: man:sshd(8)
             man:sshd_config(5)
    Process: 1094 ExecStartPre=/usr/sbin/sshd -t (code=exited, status=0/SUCCESS)
   Main PID: 1095 (sshd)
      Tasks: 1 (limit: 1141)
     Memory: 1.4M
        CPU: 16ms
     CGroup: /system.slice/ssh.service
             └─1095 "sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups"

Oct 14 03:39:33 systemd[1]: Starting ssh.service - OpenBSD Secure Shell server...
Oct 14 03:39:33 sshd[1095]: Server listening on :: port 22.
Oct 14 03:39:33 systemd[1]: Started ssh.service - OpenBSD Secure Shell server.
```

对比一下我令一台Debian 13的ssh服务状态
```bash
systemctl status ssh

● ssh.service - OpenBSD Secure Shell server
     Loaded: loaded (/usr/lib/systemd/system/ssh.service; enabled; preset: enabled)
     Active: active (running) since Tue 2025-09-23 14:15:58 UTC; 2 weeks 6 days ago
 Invocation:
       Docs: man:sshd(8)
             man:sshd_config(5)
    Process: 1076 ExecStartPre=/usr/sbin/sshd -t (code=exited, status=0/SUCCESS)
   Main PID: 1079 (sshd)
      Tasks: 6 (limit: 1130)
     Memory: 133.2M (peak: 325.1M)
        CPU: 11min 9.463s
     CGroup: /system.slice/ssh.service
             ├─ 1079 "sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups"
             ├─56815 "sshd-session: root [priv]"
             ├─56824 "sshd-session: root@pts/0"
             ├─56825 -bash
             ├─56830 systemctl status ssh
             └─56831 less

...
```

观察了一会，似乎这个`ssh.socket`比较可疑
```bash
TriggeredBy: ● ssh.socket
```

看一下这个`ssh.socket`
```bash
systemctl status ssh.socket

● ssh.socket - OpenBSD Secure Shell server socket
     Loaded: loaded (/lib/systemd/system/ssh.socket; enabled; preset: enabled)
     Active: active (running) since Tue 2025-10-14 03:11:47 EDT; 28min ago
   Triggers: ● ssh.service
     Listen: [::]:22 (Stream)
      Tasks: 0 (limit: 1141)
     Memory: 4.0K
        CPU: 312us
     CGroup: /system.slice/ssh.socket

Oct 14 03:11:47 systemd[1]: Listening on ssh.socket - OpenBSD Secure Shell server socket.
```

看一下`/lib/systemd/system/ssh.socket`的内容
```bash
# file: /lib/systemd/system/ssh.socket

[Unit]
Description=OpenBSD Secure Shell server socket
Before=sockets.target
ConditionPathExists=!/etc/ssh/sshd_not_to_be_run

[Socket]
ListenStream=22
Accept=no

[Install]
WantedBy=sockets.target
```

看起来这就是修改端口无效的原因

## 解决
修改`/lib/systemd/system/ssh.socket`内的`ListenStream`，重启ssh服务
```bash
# edit /lib/systemd/system/ssh.socket
nano /lib/systemd/system/ssh.socket

systemctl daemon-reload
systemctl restart ssh
```
