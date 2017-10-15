#create database dropbox;

use dropbox;

create table users (username varchar(25) primary key, firstname varchar(15) not null, 
		lastname varchar(15) not null, hashpassword varchar(150) not null, salt varchar(100) not null);

drop table users;            
#select * from users;

#delete from users;

create table dropboxstorage (id integer auto_increment primary key, 
name varchar(50) not null, type ENUM('f', 'd'), path varchar(21844) not null,
 creationtime datetime, 
 size float, ownerusername varchar(25) not null, 
 starred boolean not null default false, 
 sharedstatus boolean not null default false,
 foreign key(ownerusername) references users(username)); 
    
drop table dropboxstorage;

-- insert into dropboxstorage (name, type, path, creationtime, modifiedtime, size, ownerusername) 
-- values('WhatsApp Image 2017-09-02 at 8.53.34 AM.jpeg','f','./dropboxstorage/varun@yaho.com/WhatsApp Image 2017-09-02 at 8.53.34 AM.jpeg','Sun Oct 08 2017 01:01:12 GMT-0700 (PDT)','Sun Oct 08 2017 01:01:12 GMT-0700 (PDT)','0','varun@yaho.com');

select * from dropboxstorage;

create table sharedetails (shareid integer auto_increment primary key, 
	shareditemid integer not null, 
	sharedwith varchar(25) not null, 
    foreign key(shareditemid) references dropboxstorage(id) ON DELETE CASCADE,
    foreign key(sharedwith) references users(username) ON DELETE CASCADE
    );
    
create table useractivities (useractivityid integer auto_increment primary key, 
	activitytype ENUM ('signup','login') not null,
    username varchar(25) not null,
    activitytime datetime not null,    
    foreign key(username) references users(username) ON DELETE CASCADE    
    ); 


create table storageactivities (fileactivityid integer auto_increment primary key, 
	itemid integer not null,	
	activitytype ENUM ('insert','share','unshared','delete','starred','unstarred'),
    username varchar(25) not null,
    activitytime datetime not null,
    foreign key(itemid) references dropboxstorage(id) ON DELETE CASCADE,
    foreign key(username) references users(username) ON DELETE CASCADE    
    ); 



drop table users;   
drop table dropboxstorage;
drop table sharedetails;
drop table useractivities;
drop table storageactivities;
    
update dropboxstorage

set sharedstatus = true where id = 1;