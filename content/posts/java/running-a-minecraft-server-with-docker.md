Close your eyes for one moment and imagine that everything you host runs in docker containers.
You no longer need to battle system dependencies, and configurations are more manageable; it is now easier to backup and transfer your applications.

In my quest to dockerize everything, I am now dockerizing my Minecraft server.
Minecraft is a relatively simple application to host since it is just a single Java application that you need to run.
To put this in Docker, we need to declare a Java Docker image that launches our Minecraft server.

```bash
FROM openjdk:8u232

WORKDIR /root/minecraft

CMD java -Xmx2048M -jar spigot-1.10.jar -o true
```

To make this Docker container work, we need to mount the volume containing our Minecraft files to the path "/root/minecraft" in our Docker container.
By mounting the volume, it enables us the persist the data between consecutive runs.


To orchestrate all of my Docker containers, I am using Docker-compose.
Although there is only one container for this instance, I can add additional services to this file; for example, If I had a website that went along with my server, I could use docker-compose to launch both the Minecraft server and the server's website.

```yaml
version: "2.2"

networks:
  bridge-network:
    external:
      name: bridge-network

services:
  minecraft:
    restart: always
    image: minecraft
    build: ./minecraft-docker
    networks:
      - bridge-network
    volumes:
      - "./minecraft:/root/minecraft"
    ports:
      - "8123:8123"
      - "25565:25565"
```

To expose the Minecraft server to the internet, we need to tell docker-compose the applications ports.
I am using a bridged docker network along with appending the ports in the docker-compose configuration file.
Port 25565 is the default Minecraft server port, and port 8123 gets used by Dynmap.
To create the network bridge, you need to run this command once.

```bash
docker network create -d bridge bridge-network
```

We need to execute the build command to generate our new Minecraft Docker container:

```bash
docker-compose build
```

To launch the server, we just run the compose-up command.

```bash
docker-compose up
```

One quick note on the file structure that I am employing for this project:
I like to keep the Dockerfiles in a directory separate from any volumes that I am mounting within those containers.
Additionally, it is a good practice to have your docker-compose file at the root directory.


```bash
╭─jeff@dangerous ~/Docker 
╰─$ tree -L 2
.
├── docker-compose.yml
├── minecraft
│   ├── banned-ips.json
│   ├── banned-players.json
│   ├── bukkit.yml
│   ├── commands.yml
│   ├── crash-reports
│   ├── eula.txt
│   ├── logs
│   ├── ops.json
│   ├── permissions.yml
│   ├── plugins
│   ├── run.bat
│   ├── server-icon.png
│   ├── server.properties
│   ├── spigot-1.10.jar
│   ├── spigot.yml
│   ├── survival
├── minecraft-docker
│   └── Dockerfile
└── README.md
```


Docker will scan the entire director before building a project-- Docker does this so it knows what caches it can use during an incremental build.
To improve the build time, I add the Minecraft server folder to the docker-ignore file to prevent Docker from scanning all the world artifacts.

```bash
# .dockerignore file
minecraft
```