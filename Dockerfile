# jeffery russell 12-17-2020

FROM node:buster-slim

WORKDIR /src/


# installs pandoc for markdown to html
# need git so admin page can pull blog updates
RUN apt-get update && \
    apt-get install sqlite3 -y && \
    apt-get install pandoc -y && \
    apt-get install git -y

# installs node dependencies
ADD package.json package.json
RUN npm install

# exposes port application runs on
EXPOSE 8000

# launch command
CMD npm start