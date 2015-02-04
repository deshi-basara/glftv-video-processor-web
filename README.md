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

==============
### Deployment

1. Change the 'apiUrl' inside 'client/app/scripts/app.js' (l. 30) to fit your URL/Server-IP
2. Minificate & concat your client-code

```Shell
[client]$  gulp build   # will be build into client/dist
```

3. Copy your minificated client-code inside 'server/assets'

```Shell
[client]$  gulp deploy
```

4. Upstart your redis-server (connection-config: 'server/config/connections.js')
5. Upstart the sailsjs-server

```Shell
[server]$  sails lift --prod
or
[server]$  forever start app.js --prod
```

6. Default settings & profiles will be initiated on the first server start
7. Connect to http://URL:1337/#/register and create an account (Email-restrictions can be changed in 'server/api/controllers/UserController.js' (l. 67-69))



========
### Todo

* Extra-Features (Mailer, Scheduler, etc.)
* Socket Auth


==============
### Known Bugs



========
### Demo

![Demo 1](http://i.imgur.com/Q7aa8er.png)
![Demo 2](http://i.imgur.com/L2FLKno.png)


===========
### Credits

* [Interface inspiration](http://www.deviantart.com/art/Taskmanager-Admin-UI-408633695)
