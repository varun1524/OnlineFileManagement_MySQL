CREATE DATABASE  IF NOT EXISTS `dropbox` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `dropbox`;
-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: 127.0.0.1    Database: dropbox
-- ------------------------------------------------------
-- Server version	5.7.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `dropboxstorage`
--

DROP TABLE IF EXISTS `dropboxstorage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dropboxstorage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` enum('f','d') DEFAULT NULL,
  `path` varchar(21844) NOT NULL,
  `creationtime` datetime DEFAULT NULL,
  `size` float DEFAULT NULL,
  `ownerusername` varchar(25) NOT NULL,
  `starred` tinyint(1) NOT NULL DEFAULT '0',
  `sharedstatus` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `ownerusername` (`ownerusername`),
  CONSTRAINT `dropboxstorage_ibfk_1` FOREIGN KEY (`ownerusername`) REFERENCES `users` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dropboxstorage`
--

LOCK TABLES `dropboxstorage` WRITE;
/*!40000 ALTER TABLE `dropboxstorage` DISABLE KEYS */;
INSERT INTO `dropboxstorage` VALUES (1,'varun','d','./dropboxstorage/varun@yahoo.com/','2017-10-16 04:26:51',68,'varun@yahoo.com',1,0),(2,'Starbucks Coffee.docx','f','./dropboxstorage/varun@yahoo.com/varun/','2017-10-16 05:56:41',68,'varun@yahoo.com',0,0),(3,'test.html','f','./dropboxstorage/varun@yahoo.com/','2017-10-16 05:56:41',102,'varun@yahoo.com',1,0),(4,'Screen Shot 2017-10-15 at 10.53.45 PM.png','f','./dropboxstorage/varun@yahoo.com/','2017-10-16 05:57:11',136,'varun@yahoo.com',0,0),(5,'shah','d','./dropboxstorage/varun@yahoo.com/varun/','2017-10-16 05:56:55',102,'varun@yahoo.com',0,1),(6,'Screen Shot 2017-10-15 at 10.49.25 PM.png','f','./dropboxstorage/varun@yahoo.com/varun/shah/','2017-10-16 05:57:26',68,'varun@yahoo.com',0,0),(7,'Screen Shot 2017-10-15 at 10.49.27 PM.png','f','./dropboxstorage/varun@yahoo.com/varun/shah/','2017-10-16 05:57:32',102,'varun@yahoo.com',0,0),(8,'Screen Shot 2017-10-15 at 10.53.45 PM.png','f','./dropboxstorage/varun@yahoo.com/varun/shah/','2017-10-16 05:57:32',102,'varun@yahoo.com',0,0),(9,'Screen Shot 2017-10-15 at 10.53.48 PM.png','f','./dropboxstorage/varun@yahoo.com/varun/shah/','2017-10-16 05:57:33',170,'varun@yahoo.com',0,0),(10,'new folder','d','./dropboxstorage/varun@yahoo.com/','2017-10-16 05:57:20',170,'varun@yahoo.com',0,0),(11,'ashna','d','./dropboxstorage/ashna@yahoo.com/','2017-10-16 05:56:06',68,'ashna@yahoo.com',1,0),(12,'abc','d','./dropboxstorage/ashna@yahoo.com/','2017-10-16 06:09:23',102,'ashna@yahoo.com',0,0),(13,'Screen Shot 2017-10-15 at 10.53.45 PM.png','f','./dropboxstorage/ashna@yahoo.com/ashna/','2017-10-16 06:09:23',68,'ashna@yahoo.com',0,0),(14,'Screen Shot 2017-10-15 at 10.53.48 PM.png','f','./dropboxstorage/ashna@yahoo.com/ashna/','2017-10-16 06:09:37',102,'ashna@yahoo.com',0,0),(15,'Screen Shot 2017-10-15 at 10.59.42 PM.png','f','./dropboxstorage/ashna@yahoo.com/ashna/','2017-10-16 06:09:37',102,'ashna@yahoo.com',0,0),(16,'Screen Shot 2017-10-15 at 10.59.43 PM.png','f','./dropboxstorage/ashna@yahoo.com/ashna/','2017-10-16 06:09:37',170,'ashna@yahoo.com',0,0),(17,'Screen Shot 2017-10-15 at 11.08.14 PM.png','f','./dropboxstorage/ashna@yahoo.com/ashna/','2017-10-16 06:09:37',204,'ashna@yahoo.com',0,0),(18,'Screen Shot 2017-10-15 at 11.08.56 PM.png','f','./dropboxstorage/ashna@yahoo.com/ashna/','2017-10-16 06:09:37',204,'ashna@yahoo.com',0,0),(19,'Screen Shot 2017-10-15 at 11.08.14 PM.png','f','./dropboxstorage/ashna@yahoo.com/','2017-10-16 06:09:31',136,'ashna@yahoo.com',0,0),(20,'Screen Shot 2017-10-15 at 11.08.56 PM.png','f','./dropboxstorage/ashna@yahoo.com/','2017-10-16 06:09:47',170,'ashna@yahoo.com',0,0),(21,'Starbucks Coffee.docx','f','./dropboxstorage/ashna@yahoo.com/','2017-10-16 06:09:47',170,'ashna@yahoo.com',0,0),(22,'test.html','f','./dropboxstorage/ashna@yahoo.com/','2017-10-16 06:09:47',170,'ashna@yahoo.com',0,0),(23,'kbc','d','./dropboxstorage/ashna@yahoo.com/ashna/','2017-10-16 06:09:37',272,'ashna@yahoo.com',0,1),(24,'Screen Shot 2017-10-15 at 11.08.56 PM.png','f','./dropboxstorage/ashna@yahoo.com/ashna/kbc/','2017-10-16 06:10:03',68,'ashna@yahoo.com',0,0);
/*!40000 ALTER TABLE `dropboxstorage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sharedetails`
--

DROP TABLE IF EXISTS `sharedetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sharedetails` (
  `shareid` int(11) NOT NULL AUTO_INCREMENT,
  `shareditemid` int(11) NOT NULL,
  `sharedwith` varchar(25) NOT NULL,
  PRIMARY KEY (`shareid`),
  KEY `shareditemid` (`shareditemid`),
  KEY `sharedwith` (`sharedwith`),
  CONSTRAINT `sharedetails_ibfk_1` FOREIGN KEY (`shareditemid`) REFERENCES `dropboxstorage` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sharedetails_ibfk_2` FOREIGN KEY (`sharedwith`) REFERENCES `users` (`username`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sharedetails`
--

LOCK TABLES `sharedetails` WRITE;
/*!40000 ALTER TABLE `sharedetails` DISABLE KEYS */;
INSERT INTO `sharedetails` VALUES (1,5,'varun@shah.com'),(2,5,'ashna@yahoo.com'),(3,23,'varun@yahoo.com');
/*!40000 ALTER TABLE `sharedetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `storageactivities`
--

DROP TABLE IF EXISTS `storageactivities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `storageactivities` (
  `activityid` int(11) NOT NULL AUTO_INCREMENT,
  `itemid` int(11) NOT NULL,
  `activitytype` enum('insert','share','unshared','delete','starred','unstarred') DEFAULT NULL,
  `username` varchar(25) NOT NULL,
  `activitytime` datetime NOT NULL,
  PRIMARY KEY (`activityid`),
  KEY `itemid` (`itemid`),
  KEY `username` (`username`),
  CONSTRAINT `storageactivities_ibfk_1` FOREIGN KEY (`itemid`) REFERENCES `dropboxstorage` (`id`) ON DELETE CASCADE,
  CONSTRAINT `storageactivities_ibfk_2` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `storageactivities`
--

LOCK TABLES `storageactivities` WRITE;
/*!40000 ALTER TABLE `storageactivities` DISABLE KEYS */;
INSERT INTO `storageactivities` VALUES (1,1,'insert','varun@yahoo.com','2017-10-16 05:56:41'),(2,2,'insert','varun@yahoo.com','2017-10-16 05:56:55'),(3,3,'insert','varun@yahoo.com','2017-10-16 05:57:11'),(4,1,'starred','varun@yahoo.com','2017-10-16 05:57:14'),(5,4,'insert','varun@yahoo.com','2017-10-16 05:57:20'),(6,5,'insert','varun@yahoo.com','2017-10-16 05:57:26'),(7,6,'insert','varun@yahoo.com','2017-10-16 05:57:33'),(8,7,'insert','varun@yahoo.com','2017-10-16 05:57:33'),(9,8,'insert','varun@yahoo.com','2017-10-16 05:57:33'),(10,9,'insert','varun@yahoo.com','2017-10-16 05:57:33'),(11,5,'share','varun@yahoo.com','2017-10-16 05:57:48'),(12,5,'share','varun@yahoo.com','2017-10-16 05:57:48'),(13,10,'insert','varun@yahoo.com','2017-10-16 06:08:50'),(14,11,'insert','ashna@yahoo.com','2017-10-16 06:09:23'),(15,12,'insert','ashna@yahoo.com','2017-10-16 06:09:31'),(16,13,'insert','ashna@yahoo.com','2017-10-16 06:09:37'),(17,15,'insert','ashna@yahoo.com','2017-10-16 06:09:37'),(18,14,'insert','ashna@yahoo.com','2017-10-16 06:09:37'),(19,16,'insert','ashna@yahoo.com','2017-10-16 06:09:37'),(20,17,'insert','ashna@yahoo.com','2017-10-16 06:09:37'),(21,18,'insert','ashna@yahoo.com','2017-10-16 06:09:37'),(22,11,'starred','ashna@yahoo.com','2017-10-16 06:09:42'),(23,19,'insert','ashna@yahoo.com','2017-10-16 06:09:47'),(24,21,'insert','ashna@yahoo.com','2017-10-16 06:09:47'),(25,20,'insert','ashna@yahoo.com','2017-10-16 06:09:47'),(26,22,'insert','ashna@yahoo.com','2017-10-16 06:09:47'),(27,23,'insert','ashna@yahoo.com','2017-10-16 06:10:03'),(28,24,'insert','ashna@yahoo.com','2017-10-16 06:10:10'),(29,23,'share','ashna@yahoo.com','2017-10-16 06:10:21'),(30,3,'starred','varun@yahoo.com','2017-10-16 06:19:06');
/*!40000 ALTER TABLE `storageactivities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `useractivities`
--

DROP TABLE IF EXISTS `useractivities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `useractivities` (
  `useractivityid` int(11) NOT NULL AUTO_INCREMENT,
  `activitytype` enum('signup','login') NOT NULL,
  `username` varchar(25) NOT NULL,
  `activitytime` datetime NOT NULL,
  PRIMARY KEY (`useractivityid`),
  KEY `username` (`username`),
  CONSTRAINT `useractivities_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `useractivities`
--

LOCK TABLES `useractivities` WRITE;
/*!40000 ALTER TABLE `useractivities` DISABLE KEYS */;
INSERT INTO `useractivities` VALUES (1,'signup','varun@yahoo.com','2017-10-16 04:26:51'),(2,'login','varun@yahoo.com','2017-10-16 04:28:39'),(3,'signup','ashna@yahoo.com','2017-10-16 05:56:06'),(4,'signup','varun@shah.com','2017-10-16 05:56:18'),(5,'login','varun@yahoo.com','2017-10-16 05:56:35'),(6,'login','ashna@yahoo.com','2017-10-16 06:09:12'),(7,'login','varun@yahoo.com','2017-10-16 06:19:01');
/*!40000 ALTER TABLE `useractivities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userprofile`
--

DROP TABLE IF EXISTS `userprofile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userprofile` (
  `overview` varchar(100) DEFAULT NULL,
  `work` varchar(15) DEFAULT NULL,
  `education` varchar(50) DEFAULT NULL,
  `contactinfo` varchar(10) DEFAULT NULL,
  `lifeevents` varchar(100) DEFAULT NULL,
  `music` tinyint(1) DEFAULT '0',
  `sports` tinyint(1) DEFAULT '0',
  `reading` tinyint(1) DEFAULT '0',
  `username` varchar(25) DEFAULT NULL,
  KEY `username` (`username`),
  CONSTRAINT `userprofile_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userprofile`
--

LOCK TABLES `userprofile` WRITE;
/*!40000 ALTER TABLE `userprofile` DISABLE KEYS */;
/*!40000 ALTER TABLE `userprofile` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(25) NOT NULL,
  `firstname` varchar(15) NOT NULL,
  `lastname` varchar(15) NOT NULL,
  `hashpassword` varchar(150) NOT NULL,
  `salt` varchar(100) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('ashna@yahoo.com','ashn','shah','$2a$10$qDQXyKprmaqI.lOpnwBrdu/iW2/Zk54s85HQxWPwhZHG3uFjW8a..','$2a$10$qDQXyKprmaqI.lOpnwBrdu'),('varun@shah.com','varun','shah','$2a$10$pDRgj54KqDoqzWtcY84qmODCCigOsjp5Ai9GUiM79/WGvWstK6pYu','$2a$10$pDRgj54KqDoqzWtcY84qmO'),('varun@yahoo.com','varun','shah','$2a$10$zxLSqV1Z2zxz6Dxi.b0zhuwVVUsVH//S1TPjqR/LkrrtjKezVJO5u','$2a$10$zxLSqV1Z2zxz6Dxi.b0zhu');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-10-15 23:49:41
