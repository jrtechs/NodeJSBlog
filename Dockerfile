# jeffery russell 12-17-2020


FROM node:buster-slim

WORKDIR /src/


# installs node dependencies
RUN npm install
ADD package.json package.json

# installs pandoc
RUN apt-get update && \
    apt-get install pandoc -y

# exposes port application runs on
EXPOSE 8000

# launch command
CMD npm start