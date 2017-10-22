use dropbox;

create table users (
	username varchar(25) primary key, 
	firstname varchar(15) not null, 
	lastname varchar(15) not null, 
    hashpassword varchar(150) not null, 
	salt varchar(100) not null
);
        
create table userprofile (
	overview varchar(100),work varchar(15), 
	education varchar(50), 
    contactinfo varchar(10), 
    lifeevents varchar(100),
    music boolean default false,
    sports boolean default false,
    reading boolean default false,
    username varchar(25) unique not null,
    foreign key(username) references users(username) ON delete cascade);

create table dropboxstorage (
	id integer auto_increment primary key, 
	name varchar(50) not null, 
	type ENUM('f', 'd'), 
	path varchar(21844) not null,
	creationtime datetime, 
	size float, 
    ownerusername varchar(25) not null, 
	starred boolean not null default false, 
	sharedstatus boolean not null default false,
	foreign key(ownerusername) references users(username)); 

create table sharedetails (
	shareid integer auto_increment primary key, 
	shareditemid integer not null, 
	sharedwith varchar(25) not null, 
    foreign key(shareditemid) references dropboxstorage(id) ON DELETE CASCADE,
    foreign key(sharedwith) references users(username) ON DELETE CASCADE
    );
    
create table useractivities (
	useractivityid integer auto_increment primary key, 
	activitytype ENUM ('signup','login') not null,
    username varchar(25) not null,
    activitytime datetime not null,    
    foreign key(username) references users(username) ON DELETE CASCADE    
    ); 


create table storageactivities (
	activityid integer auto_increment primary key, 
	itemid integer not null,	
	activitytype ENUM ('insert','share','unshared','delete','starred','unstarred'),
    username varchar(25) not null,
    activitytime datetime not null,
    foreign key(itemid) references dropboxstorage(id) ON DELETE CASCADE,
    foreign key(username) references users(username) ON DELETE CASCADE    
    ); 


#For Later
-- create table groupdetails (
-- 	groupid integer auto_increment primary key, 
--     groupname varchar(25) not null,
-- 	ownerusername varchar(25) not null,	    
--     foreign key(ownerusername) references users(username) ON DELETE CASCADE    
--     ); 
--     
-- create table groupmembers (
-- 	id integer auto_increment primary key,
-- 	groupid integer not null,
-- 	memberusername varchar(25) not null,
--     foreign key(memberusername) references users(username) ON DELETE CASCADE,
--     foreign key(groupid) references groupdetails(groupid) ON DELETE CASCADE
--     );
--     
-- create table groupcontent (
-- 	id integer auto_increment primary key,
-- 	groupid integer not null,
--     foreign key(groupid) references groupdetails(groupid) ON DELETE CASCADE
--     );    

drop table storageactivities;
drop table useractivities;
drop table userprofile;
drop table sharedetails;
drop table dropboxstorage;
drop table users;