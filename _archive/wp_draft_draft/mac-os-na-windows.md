---
layout: post
status: draft
title: Mac OS на Windows
author:
  display_name: SlowProg
  login: seoadmin
  email: paperplanesu@rambler.ru
  url: http://paperplane.su
author_login: seoadmin
author_email: paperplanesu@rambler.ru
author_url: http://paperplane.su
wordpress_id: 2543
wordpress_url: http://paperplane.su/?p=2543
date: '2012-06-25 23:28:27 +0400'
categories:
- Блог
tags: []
comments: []
---
<p><a href="http:&#47;&#47;www.mahmood1.com&#47;Mac_OSX_Lion_vmware_WindowsPC.php">http:&#47;&#47;www.mahmood1.com&#47;Mac_OSX_Lion_vmware_WindowsPC.php<&#47;a></p>
<p><a href="http:&#47;&#47;dmitry-novak.livejournal.com&#47;45632.html?thread=770624">http:&#47;&#47;dmitry-novak.livejournal.com&#47;45632.html?thread=770624<&#47;a></p>
<p>This guide will teach you how to get Mac OS X Lion 10.7.2 on your Windows PC so you can use iReSign!</p>
<p>Download Mac OS X Lion 10.7.2 Pre-Installed VMware Workstation 8 Image For Windows PC:<br />
Download: http:&#47;&#47;iMZDL.com</p>
<p>How to Patch VMware Workstation 8 and start using Mac OS X Lion (follow these steps):<br />
In order to get Mac OS X Lion working on Windows PC that has VMware Workstation 8 installed you need to patch some files. To get it working please follow these steps in order to have a successful patch. So follow these steps carefully make no mistake and read every step and do exactly what it says<br />
. In&nbsp;order to know if&nbsp;your PC is capable&nbsp;of virtualization and how to&nbsp;enable it in&nbsp;BIOS please download this&nbsp;software from Microsoft:&nbsp;http:&#47;&#47;www.microsoft.com&#47;windows&#47;virtual-pc&#47;support&#47;configure-bios.aspx<br />
. Install VMware Workstation 8&nbsp;(serials included) and restart PC.<br />
. Open task manager and then go to Processes and below at the bottom click&nbsp;SHOW PROCESSES FROM ALL USERS<br />
.<br />
. Kill all vmware processes there should be 5-6 of them end all of them<br />
. The VMware workstion 8 patch - put all that is contained (files and folders) to C: drive or to the drive where you have installed Windows (very important these files and folders must be&nbsp;extracted to drive C: (bsdiff folder , bspatch.exe, Darwin.iso, Darwin.sig.iso, install.cmd, uninstall.cmd)<br />
.</p>
<p>. Now go to START and search for&nbsp;CMD and right click and run it as ADMINISTRATOR&nbsp;(this is very important!!)&nbsp;In CMD you get this window when u use it as administrator :<br />
.</p>
<p>. The files will be patched and you will get message that the files are copied and patched and VMware services will start running again after the patch. You will get the below cmd screen, if you have this then the files are patched and restart computer.<br />
. Microsoft Windows [Version 6.2.8102]<br />
. (c) 2011 Microsoft Corporation. All rights reserved.C:\Windows\system32><br />
. C:\Windows\system32>cd c:\c:\><br />
. c:\>install.cmd<br />
. VMware Unlocker 1.0.0<br />
. =====================<br />
. (c) Dave Parsons 2011<br />
. Stopping VMware services...<br />
. The VMware Workstation Server service is stopping.<br />
. The VMware Workstation Server service was stopped successfully.<br />
. The VMware Authorization Service service was stopped successfully.<br />
. Creating backup folders...<br />
. The system cannot find the file specified.<br />
. The system cannot find the file specified.<br />
. Core=VMware Workstation<br />
. InstallPath=C:\Program Files (x86)\VMware\VMware Workstation\<br />
. Saving 64-bit files...<br />
. C:\Program Files (x86)\VMware\VMware Workstation\x64\vmware-vmx.exe -> C:\backup\x64\vmware-vmx.exe<br />
. 1 File(s) copied<br />
. C:\Program Files (x86)\VMware\VMware Workstation\x64\vmware-vmx-debug.exe -> C:\backup\x64\vmware-vmx-debug.exe<br />
. 1 File(s) copied<br />
. C:\Program Files (x86)\VMware\VMware Workstation\x64\vmware-vmx-stats.exe -> C:\backup\x64\vmware-vmx-stats.exe<br />
. 1 File(s) copied<br />
. Patching 64-bit files...<br />
. Copying 64-bit files to VMware folder...<br />
. C:\bin\x64\vmware-vmx-debug.exe -> C:\Program Files (x86)\VMware\VMware Workstation\x64\vmware-vmx-debug.exe<br />
. C:\bin\x64\vmware-vmx-stats.exe -> C:\Program Files (x86)\VMware\VMware Workstation\x64\vmware-vmx-stats.exe<br />
. C:\bin\x64\vmware-vmx.exe -> C:\Program Files (x86)\VMware\VMware Workstation\x64\vmware-vmx.exe<br />
. 3 File(s) copied<br />
. Saving 32-bit files...<br />
. C:\Program Files (x86)\VMware\VMware Workstation\vmware-vmx.exe -> C:\backup\vmware-vmx.exe<br />
. 1 File(s) copied<br />
. C:\Program Files (x86)\VMware\VMware Workstation\vmware-vmx-debug.exe -> C:\back<br />
. up\vmware-vmx-debug.exe<br />
. 1 File(s) copied<br />
. C:\Program Files (x86)\VMware\VMware Workstation\vmware-vmx-stats.exe -> C:\backup\vmware-vmx-stats.exe<br />
. 1 File(s) copied<br />
. C:\Program Files (x86)\VMware\VMware Workstation\vmwarebase.dll -> C:\backup\vmwarebase.dll<br />
. 1 File(s) copied<br />
. Patching 64-bit files...<br />
. Copying 32-bit files to VMware folder...<br />
. C:\bin\vmware-vmx-debug.exe -> C:\Program Files (x86)\VMware\VMware Workstation\vmware-vmx-debug.exe<br />
. C:\bin\vmware-vmx-stats.exe -> C:\Program Files (x86)\VMware\VMware Workstation\vmware-vmx-stats.exe<br />
. C:\bin\vmware-vmx.exe -> C:\Program Files (x86)\VMware\VMware Workstation\vmware-vmx.exe<br />
. C:\bin\vmwarebase.dll -> C:\Program Files (x86)\VMware\VMware Workstation\vmware<br />
. base.dll<br />
. 4 File(s) copied<br />
. C:\darwin.iso -> C:\Program Files (x86)\VMware\VMware Workstation\darwin.iso<br />
. C:\darwin.iso.sig -> C:\Program Files (x86)\VMware\VMware Workstation\darwin.iso.sig<br />
. 2 File(s) copied<br />
. Starting VMware services...<br />
. The VMware Authorization Service service is starting.<br />
. The VMware Authorization Service service was started successfully.The VMware Workstation Server service is starting.<br />
. The VMware Workstation Server service was started successfully.c:\><br />
. Now restart your Computer and the start VMware workstation, in VMware screen choose : Open VMware Machine<br />
.</p>
<p>. Browse to the drive where you have unzipped and saved Mac OS X Lion folder and open it and choose mac os x lion.vmx<br />
.</p>
<p>. Now VMware will open Mac OS X Lion. To edit it, choose edit this virtual PC and to start it : choose power on this virtual machine.</p>
<p>.</p>
<p>. In password area dont fill out anything, just put mouse cursor in password area and hit ENTER, NO PASSWORD NEEDED!!<br />
. If you&nbsp;wants to install applications and Mac OSX asks for administration password just leave it blank and hit the OK button.<br />
iReSign Time:<br />
Open iReSign2.0.zip thats in the original download for the VMware Image and there you go!<br />
For instructions on how to use iReSign check out: http:&#47;&#47;iMZDL.com&#47;udid2&#47;faq2</p>
<p>&nbsp;</p>
