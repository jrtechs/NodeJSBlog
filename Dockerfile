# jeffery russell 12-17-2020

FROM node:buster-slim

WORKDIR /src/


# installs node dependencies

ADD package.json package.json
RUN npm install

# installs pandoc for markdown to html
# need git so admin page can pull blog updates
RUN apt-get update && \
    apt-get install pandoc -y && \
    apt-get install git -y

# exposes port application runs on
EXPOSE 8000

# launch command
CMD npm start