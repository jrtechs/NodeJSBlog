


Alrighty, folks, this blog post is pretty straightforward from the title.
We are going to be running [Scala](https://scala-lang.org/) code in [Docker](https://www.docker.com/) containers.
Specifically, we will be using SBT and docker-compose.
SBT is a built tool primarily used by Scala developers, and docker-compose is a tool for defining docker environments.

To start, we need to create a simple Docker container that can build our scala code.
From an existing Java JDK container, SBT is straightforward to install from a package manager.

```bash
FROM openjdk:8u232

ARG SBT_VERSION=1.4.1

# Install sbt
RUN \
  mkdir /working/ && \
  cd /working/ && \
  curl -L -o sbt-$SBT_VERSION.deb https://dl.bintray.com/sbt/debian/sbt-$SBT_VERSION.deb && \
  dpkg -i sbt-$SBT_VERSION.deb && \
  rm sbt-$SBT_VERSION.deb && \
  apt-get update && \
  apt-get install sbt && \
  cd && \
  rm -r /working/ && \
  sbt sbtVersion

RUN mkdir -p /root/build/project
ADD build.sbt /root/build/
ADD ./project/plugins.sbt /root/build/project
RUN cd /root/build && sbt compile

EXPOSE 9000
WORKDIR /root/build

CMD sbt compile run
```

There are a few things to note about this docker file.
First, we are only adding the two SBT files and then running a simple SBT compile command when we build the container. 
This SBT compile command only used to pull in general dependencies so that the end Docker container can launch faster.
Second, notice that we are exposing port 9000; this port is only for the web application I am building. Finally, note that /root/build will be the root directory for the Scala SBT application.


For reference, I include the two SBT files I'm using in this project:

build.sbt:
```bash
name := """alert-api"""
organization := "net.jrtechs"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.2"

resolvers += Resolver.JCenterRepository

libraryDependencies += guice

libraryDependencies += "net.katsstuff" %% "ackcord"                 % "0.16.1" //For high level API, includes all the other modules

libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "5.0.0" % Test

libraryDependencies += "org.mongodb.scala" %% "mongo-scala-driver" % "2.9.0"
```

plugins.sbt:
```bash
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.8.1")
addSbtPlugin("org.foundweekends.giter8" % "sbt-giter8-scaffold" % "0.11.0")
```

Now that we have our docker file, we can create our docker-compose script to launch the application.
For this application, I am attaching the container to a simple bridged network with a port exposed.

```yaml
version: '3.1'

networks:
  external-network:
    external:
      name: external-network

services:

  sbt:
    build:
      context: ./
      dockerfile: ./docker/Dockerfile
    image: sbt
    ports:
      - "9000:9000"
    volumes:
      - "./:/root/build"
    networks:
      - external-network
```

The main thing to note about the docker-compose script is that I placed our Dockerfile in a separate docker directory. Additionally, I'm mounting the scala project directory into the container as /root/build. The volume enables us to edit the project on our local machine while the Docker container compiles our code.

To create the docker network, we need to issue this command -- it only needs to be run once.
```bash
docker network create -d bridge external-network
```

To run the project, we can use the docker-compose up command: 

```bash
docker-compose run
```

To use the SBT shell, we need to open a terminal to the running container. After we have the shell, we can issue all of our standard SBT commands.
To properly forward the required ports when using docker-compose run, you need to pass in the "--service-ports" flag.

```bash
docker-compose run --service-ports sbt /bin/bash 
sbt
compile
run
```

Since the location where we launch docker-compose is in the same directory as all of our scala code and build artifacts, we must create a ".dockerignore" file. Otherwise, Docker will scan the entire directory before building the container -- causing massive frustration. The "**" in the Docker ignore file tells Docker to ignore everything, and the "!" tells Docker to include that file. Alternatively, we could have just excluded the target build directory.

```bash
**
!docker
!build.sbt
!project/plugins.sbt
```

That is it. I enjoy the docker approach towards developing Scala applications since it keeps the environment consistent across machines.
As someone who enjoys distro-hopping, it is nice not having to figure out how to install Java, SBT, Scala, and countless other development environments on every operating system I use.
I only need to install a text editor and Docker to develop projects with vastly different build environments and configurations. 
All the complexity with setting up the environment can get relegated to the Docker container.

This approach went over a container geared towards Scala development. For production, I would recommend that you use this SBT image to build a fat JAR, and then copy it into a lightweight JRE container using Docker's multi-stage build functionality.
