# NodeJSBlog
Recreating my wordpress blog in node JS.

## MYSQL Information

```SQL
create database blog_name;

use blog_name;

create table users(
user_id mediumint unsigned not null AUTO_INCREMENT,
first_name varchar(20) not null,
last_name varchar(40) not null,
user_name varchar(60) not null,
pass char(40) not null,
registration_date datetime not null,
admin boolean not null,
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
user_id mediumint unsigned not null,
picture_url varchar(100) not null,
published datetime not null,
url varchar(100) not null,
name varchar(100) not null,
primary key(post_id)
);

create table popular_posts(
popular_post_id mediumint unsigned not null AUTO_INCREMENT,
post_id mediumint unsigned not null,
primary key(popular_post_id)
);

grant all on blog_name.* to blog_user@localhost identified by "password";

```

## Node Dependencies
```bash
npm install mysql
npm install sanitizer
npm install promise
```
