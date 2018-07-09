# NodeJSBlog
This is a project I did to recreate my word press blog using plane node js. If I were to 
do this again, I would use PHP. NodeJS is great, however, it was a pain to deal 
with all the asynchronous calls when trying to create a web page in a linear fashion.

If you want to run this project, it requires Mysql, npm, and node to be installed. For 
deployment I used a [Nginx](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04) 
proxy to expose the node application running on port 8000 to port 80. This proxy is necessary
because you can't run a node application as port 80 unless you are root, which would be a 
security vulnerability. 


## MYSQL Information

![](blogSql.svg)

```SQL
create database jrtechs_blog;

use jrtechs_blog;

create table users(
user_id mediumint unsigned not null AUTO_INCREMENT,
user_name varchar(60) not null,
password char(64) not null,
salt char(64) not null,
primary key(user_id)
);

create table categories(
category_id mediumint unsigned not null AUTO_INCREMENT,
name varchar(60) not null,
url varchar(60) not null,
primary key(category_id)
);

create table posts(
post_id mediumint unsigned not null AUTO_INCREMENT,
category_id mediumint unsigned not null,
picture_url varchar(100) not null,
published datetime not null,
name varchar(100) not null,
url varchar(100) not null,
primary key(post_id)
);


create table downloads(
download_id mediumint unsigned not null AUTO_INCREMENT,
file varchar(40) not null,
name varchar(40) not null,
download_count mediumint not null,
primary key(download_id)
);

create table popular_posts(
popular_post_id mediumint unsigned not null AUTO_INCREMENT,
post_id mediumint unsigned not null,
primary key(popular_post_id)
);

grant all on jrtechs_blog.* to blog_user@localhost identified by "password";

```

## Node Dependencies
```bash
npm install express
npm install express-session
npm install mysql
npm install sanitizer
npm install promise
npm install highlight
npm install crypto
npm install remarkable
npm install markdown
npm install highlight.js
```


## Color scheme

[Adobe Color Wheel](https://color.adobe.com/create/color-wheel/?copy=true&base=2&rule=Custom&selected=3&name=Copy%20of%20Site&mode=rgb&rgbvalues=0.231,0.325499999999957,0.42,0,0.7450980392156863,0.6980392156862745,0.10196078431372549,0.36470588235294116,0.38823529411764707,0.8235294117647058,0.7529411764705882,1,0.3165071770335184,0.24148325358851674,0.49&swatchOrder=0,1,2,3,4)

Blue:
- Primary: #3B536B
- Secondary: #00BEB2

Purple:
- Primary: #513E7D
- Secondary: #D2C0FF
