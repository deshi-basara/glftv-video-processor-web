glftv-video-processor-web
=========================

Video-processing webinterface written with Angularjs (client) and Sailsjs (server) for transcoding video-files into the web-video-formats used by [GLFtv.de](http://glftv.de/).


===================
### Dependendencies
The following dependencies are needed globally

* Nodejs (~0.10.32)
* Redis (~2.8.17)
* FFmpeg (~2.4.2)

Dev dependencies
* Bower (~1.3.12)
* Ruby with SASS (~3.3.4)


============
### Workflow

Execute inside 'server/'
```Shell
[server]$  npm install

[server]$  sails lift
or
[server]$  supervisor -i .tmp,.git,views app.js
```

Execute inside 'client/'
```Shell
[client]$  npm install
[client]$  bower install

[client]$  gulp serve
```

========
### Todo

* Extra-Features (Mailer, Scheduler, etc.)
* Socket Auth


==============
### Known Bugs

* Fix $digest-loop bug for the round progress circle
* Update all Queue-Values via socket

========
### Demo

![Demo 1](http://i.imgur.com/Q7aa8er.png)
![Demo 2](http://i.imgur.com/L2FLKno.png)


===========
### Credits

* [Interface inspiration](http://www.deviantart.com/art/Taskmanager-Admin-UI-408633695)
