```

@echo off

color a

title server Name

 

:startServer

echo starting server

echo (%time%)

java -Xmx1024M -jar caftbukkit.jar -o true

 

echo (%time%) WARNING: Minecraft server closed or crashed, restarting

ping 127.0.0.1 -n 5

goto startServer

```

This batch script great for Minecraft servers which frequently crash – for
whatever reason. If you want to learn more about how this script works I would
recommend that you look up a batch tutorial online. This script is just a big
loop which restarts whenever the server crashes. If you like to use this, just
copy and paste it into a batch file (ends with .bat) and make sure that it is in
the same directory as your Minecraft server. Also, the “craftbukkit.jar” should
be the name of the jar file that you use to run your server.

Happy mining.
