# MYSQL Schema

![](docs/blogSql.svg)

```mysql
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

create table traffic_log(
log_id mediumint unsigned not null AUTO_INCREMENT,
url varchar(60) not null,
ip varchar(20) not null,
date datetime not null,
primary key(log_id)
);


grant all on jrtechs_blog.* to blog_user@localhost identified by "password";
```