#create database dropbox;

use dropbox;

#create table users (username varchar(25) primary key, firstname varchar(15) not null, 
	#		lastname varchar(15) not null, password varchar(12) not null); 
            
#select * from users;

#delete from users;

 create table dropboxstorage (id integer auto_increment primary key, name varchar(50) not null, 
 			type ENUM('f', 'd'), path varchar(21844) not null, creationtime varchar(60) not null, 
             modifiedtime varchar(60) not null, size float, ownerusername varchar(25) not null,
             foreign key(ownerusername) references users(username)) ; 
             
-- drop table dropboxstorage;

insert into dropboxstorage (name, type, path, creationtime, modifiedtime, size, ownerusername) 
values('WhatsApp Image 2017-09-02 at 8.53.34 AM.jpeg','f','./dropboxstorage/varun@yaho.com/WhatsApp Image 2017-09-02 at 8.53.34 AM.jpeg','Sun Oct 08 2017 01:01:12 GMT-0700 (PDT)','Sun Oct 08 2017 01:01:12 GMT-0700 (PDT)','0','varun@yaho.com');

select * from dropboxstorage;