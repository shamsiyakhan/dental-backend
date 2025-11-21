CREATE DATABASE  IF NOT EXISTS `dental` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `dental`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dental
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` varchar(50) DEFAULT NULL,
  `fullname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `phone` mediumtext DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` varchar(50) DEFAULT NULL,
  `marital_status` varchar(50) DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES ('101','Shayban . S . Khan','shayban@gmail.com','VGVzdDEyM0A=','7894561230','Pune, Maharashtra','Male','Married','1999-10-22');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `appointment_id` varchar(50) NOT NULL,
  `treatment_id` varchar(50) DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `dept_id` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `doctor_id` varchar(20) DEFAULT NULL,
  `prescription` text DEFAULT NULL,
  `finding` varchar(200) DEFAULT NULL,
  `treatment_notes` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`appointment_id`),
  KEY `fk_appointment_department` (`dept_id`),
  KEY `fk_doctor` (`doctor_id`),
  CONSTRAINT `fk_appointment_department` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`),
  CONSTRAINT `fk_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES ('7C7S1GeIgY','hZYpf3OrXJ',NULL,NULL,'Scheduled',NULL,NULL,NULL,NULL),('8NBqsw3zTM','BD3zt3DxlS','2025-10-09 18:46:19','18MIA4AsbJ','completed','oxNDA1angm',NULL,NULL,NULL),('8vIHVGewUz','DkaohLYSyJ','2025-09-19 14:54:42','18MIA4AsbJ','Assigned','oxNDA1angm','croicin 2*2 ','nothing suspecious','Everything is fine now no need for this treatment to continue'),('9B6rOL7aCY','hZYpf3OrXJ','2025-10-11 13:48:13','18MIA4AsbJ','completed','oxNDA1angm',NULL,NULL,NULL),('dJNv9IJIqO','IJHntk0O4C','2025-09-14 16:19:57','18MIA4AsbJ','Scheduled','yfsjeIoLO1',NULL,NULL,NULL),('EWlcIpLPd7','PBwvvHraP3','2025-09-16 14:36:34','18MIA4AsbJ','Scheduled','yfsjeIoLO1',NULL,NULL,NULL),('fgi6fEejtG','6CpIh13Zcm','2025-10-11 07:35:50','18MIA4AsbJ','Scheduled','Jvngj9vAnE',NULL,NULL,NULL),('fz7xRPcutb','L6hIpSWu83','2025-09-16 15:34:59','18MIA4AsbJ','Scheduled','oxNDA1angm',NULL,NULL,NULL),('G2HKTYkt4h','1QrY8VLkjx','2025-10-11 13:29:32','18MIA4AsbJ','completed','oxNDA1angm',NULL,NULL,NULL),('heCU75w8rp','uMMKcgvbi1','2025-10-06 19:17:57','18MIA4AsbJ','Scheduled','MRItIM1mFH',NULL,NULL,NULL),('HsCGJVyXSS','sOu1c5pAa2','2025-10-11 15:41:59','18MIA4AsbJ','completed','oxNDA1angm',NULL,NULL,NULL),('K0XxYX4AMZ','DODXiBSvF5','2025-10-11 14:21:09','18MIA4AsbJ','completed','oxNDA1angm',NULL,NULL,NULL),('KLxZLwqVO2','Q5nCm1O3BG','2025-10-06 19:43:10','18MIA4AsbJ','Scheduled','oxNDA1angm',NULL,NULL,NULL),('PfDchBWIru','tkpjvVT0qc','2025-10-11 08:01:49','18MIA4AsbJ','completed','oxNDA1angm',NULL,NULL,NULL),('UTrucnA3E4','6mlev8n5h7','2025-09-29 15:24:43','18MIA4AsbJ','Scheduled','oxNDA1angm',NULL,NULL,NULL),('uZGmowyQln','e8ntlewsEy','2025-10-11 07:32:16','18MIA4AsbJ','completed','oxNDA1angm',NULL,NULL,NULL),('WPv0cPSGoP','972ipWolWg','2025-09-14 16:05:26','18MIA4AsbJ','Scheduled','oxNDA1angm',NULL,NULL,NULL),('XUDUpRVDTU','wT2vL0S5Qa','2025-09-14 16:23:01','18MIA4AsbJ','Scheduled','oxNDA1angm',NULL,NULL,NULL),('YFa0UlN35w','iUbsFDiGAQ','2025-11-21 20:06:54','18MIA4AsbJ','Scheduled','oxNDA1angm',NULL,NULL,NULL);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bill`
--

DROP TABLE IF EXISTS `bill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bill` (
  `bill_id` varchar(50) NOT NULL,
  `treatment_id` varchar(50) DEFAULT NULL,
  `userid` varchar(50) DEFAULT NULL,
  `total` mediumtext DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `billtype` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`bill_id`),
  KEY `treatment_id` (`treatment_id`),
  KEY `userid` (`userid`),
  CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`treatment_id`) REFERENCES `treatment_details` (`treatment_id`) ON DELETE CASCADE,
  CONSTRAINT `bill_ibfk_2` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bill`
--

LOCK TABLES `bill` WRITE;
/*!40000 ALTER TABLE `bill` DISABLE KEYS */;
/*!40000 ALTER TABLE `bill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cheif_complaint`
--

DROP TABLE IF EXISTS `cheif_complaint`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cheif_complaint` (
  `complaint_id` varchar(50) NOT NULL,
  `patientid` varchar(50) DEFAULT NULL,
  `reporting_date` date DEFAULT NULL,
  `issue_reported` varchar(50) DEFAULT NULL,
  `tests` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tests`)),
  `total_charge` mediumtext DEFAULT NULL,
  `payment_status` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `treatment_assigned_at` date DEFAULT NULL,
  `payment_mode` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`complaint_id`),
  KEY `patientid` (`patientid`),
  CONSTRAINT `cheif_complaint_ibfk_1` FOREIGN KEY (`patientid`) REFERENCES `user` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cheif_complaint`
--

LOCK TABLES `cheif_complaint` WRITE;
/*!40000 ALTER TABLE `cheif_complaint` DISABLE KEYS */;
INSERT INTO `cheif_complaint` VALUES ('02Gl3CGMyT','eFJnNywunz','2025-09-16','Teeth Ache ','[]','50','Paid','Treatment Assigned','2025-09-16','Cash'),('03lriMApal','ZRGdofLkTS','2025-05-03','Teeth Whitening','[\"jChBSxtliq\"]','550','Paid','Treatment Assigned','2025-05-03','jChBSxtliq'),('0zvOZcaNpi','ZRGdofLkTS','2025-05-03','Teeth Whitening','[\"\"]','','Paid','Treatment Assigned','2025-05-03','Cash'),('11TUd1volv','eFJnNywunz','2025-09-29','Infections in gums','[\"\",\"jChBSxtliq\",\"2Zf7F3qhmv\"]','4550','Paid',NULL,NULL,''),('1Qmx6jB4mV','NbmtylWOsV','2025-10-06','teeth pain','[]','50','Paid','Treatment Assigned','2025-10-06','UPI'),('2kHMuwEbr1','FRaTT5t8b1','2025-10-11','Teeth Pain','[]','50','Paid','Treatment Assigned','2025-10-11','Cash'),('30k9g3DcD5','FRaTT5t8b1','2025-10-11','teeth Sesitivity','[]','50','Paid',NULL,NULL,'Cash'),('5RI3HaMZ9t','ZRGdofLkTS','2025-05-03','Teeth Cleaning','[\"jChBSxtliq\"]','550','Paid','Treatment Assigned','2025-05-03','Cash'),('6FOMrch1e1','ZRGdofLkTS','2025-05-03','teeeth Cleaning','[\"jChBSxtliq\"]','550','Paid','Treatment Assigned','2025-05-03','Cash'),('6j9XrhoZij','NbmtylWOsV','2025-10-11','Mouth swollen','[]','50','Paid','Treatment Assigned','2025-10-11','Cash'),('6UMWH0GB8I','ASTCRLvSD7','2025-09-11','Teeth Ache Shamsiya','[\"\"]','','Paid','Treatment Assigned','2025-09-11','Cash'),('8IHOD7QyAP','eFJnNywunz','2025-09-12','Canal Failure','[]','50','Paid','Treatment Assigned','2025-09-12','Cash'),('aCOeDDtQKR','eFJnNywunz','2025-09-29','Infections in gums','[\"\",\"jChBSxtliq\",\"2Zf7F3qhmv\"]','4550','Paid',NULL,NULL,''),('AiXCRL6WOu','ASTCRLvSD7','2025-08-03','Pain in teeth','[\"jChBSxtliq\"]','550','Paid',NULL,NULL,'Cash'),('AvuBY7fyRt','ZRGdofLkTS','2025-09-19','Pain in teeth','[]','50','Paid','Treatment Assigned','2025-09-19','Cash'),('AxxeUco0LQ','ASTCRLvSD7','2025-08-23','root canal','[\"jChBSxtliq\"]','550','Paid',NULL,NULL,'Cash'),('c2ywtesqLC','ASTCRLvSD7','2025-09-11','Teeth Ache Shamsiya','[\"\"]','','Paid',NULL,NULL,'Cash'),('Dq1upj1nMB','NbmtylWOsV','2025-10-11','teeth Sesitivity','[]','50','Paid','Treatment Assigned','2025-10-11','Cash'),('FKTYfttHLU','ASTCRLvSD7','2025-09-11','Teeth Ache Shamsiya','[\"\"]','','Paid',NULL,NULL,'Cash'),('I2llJCuhxO','ASTCRLvSD7','2025-08-02','Teeth removal','[\"jChBSxtliq\"]','550','Paid','Treatment Assigned','2025-08-02','jChBSxtliq'),('Is7N7Cietz','ASTCRLvSD7','2025-09-11','Teeth Ache Shamsiya','[\"\",\"jChBSxtliq\"]','550','Paid',NULL,NULL,'Cash'),('jAqxxxueLR','NbmtylWOsV','2025-10-11','fareeha','[]','50','Paid','Treatment Assigned','2025-10-11','Cash'),('jvj7gCyRnH','NbmtylWOsV','2025-10-11','Teeth cynux','[]','50','Paid','Treatment Assigned','2025-10-11','Cash'),('k378sxj50m','NbmtylWOsV','2025-10-11','teeth kamar issue','[]','50','Paid','Treatment Assigned','2025-10-11','Cash'),('l3kIgupUbU','eFJnNywunz','2025-09-16','infection in teteh','[]','50','Paid','Treatment Assigned','2025-09-16','Cash'),('ljeWtwi8kG','ASTCRLvSD7','2025-09-11','Teeth Ache Shamsiya','[\"\"]','','Paid',NULL,NULL,'Cash'),('mHTBSTpEtU','eFJnNywunz','2025-09-29','infection in teeths','[\"\",\"jChBSxtliq\"]','550','Paid',NULL,NULL,'Cash'),('MIeB0JC92K','FRaTT5t8b1','2025-10-11','Checking date','[]','50','Paid',NULL,NULL,'Cash'),('MoVvlidjrx','eFJnNywunz','2025-09-29','Infections in gums','[\"\",\"jChBSxtliq\",\"2Zf7F3qhmv\"]','4550','Paid',NULL,NULL,''),('mvtnpRjQwe','eFJnNywunz','2025-09-12','Testing Test','[]','50','Paid','Treatment Assigned','2025-09-16','Cash'),('nfmkhauwYj','FRaTT5t8b1','2025-10-11','teeth Sesitivity shayban','[]','50','Paid',NULL,NULL,'Cash'),('nJSyBllUlL','FRaTT5t8b1','2025-10-11','Testing now dates','[]','50','Paid',NULL,NULL,'Cash'),('NzoAvS79Ay','ASTCRLvSD7','2025-08-06','Testh Implant','[\"jChBSxtliq\"]','550','Paid','Treatment Assigned','2025-08-23','Cash'),('O6bOYPO2Dr','FRaTT5t8b1','2025-10-11','Testing dates','[]','50','Paid',NULL,NULL,'Cash'),('p9GCyk4pgw','NbmtylWOsV','2025-10-06','Worms in teeth','[]','50','Paid','Treatment Assigned','2025-10-06','Cash'),('PzuGm14VF9','CqwWFZDlQv','2025-09-12','Infection in mouth','[]','50','Paid','Treatment Assigned','2025-09-12','Cash'),('qwV9bP2ZcS','FRaTT5t8b1','2025-05-03','Root canal','[\"jChBSxtliq\",\"9lTojSgx7h\"]','850','Paid','Treatment Assigned','2025-05-03','Cash'),('QYHv5gYw6c','NbmtylWOsV','2025-10-11','Javed Sir Teeth ache','[]','50','Paid','Treatment Assigned','2025-10-11','Cash'),('STZilUBLtf','NbmtylWOsV','2025-10-11','teeth Sesitivity','[]','50','Paid','Treatment Assigned','2025-10-11','Cash'),('u3IWhlIs4J','eFJnNywunz','2025-05-03','Teeth Pai','[\"jChBSxtliq\",\"2Zf7F3qhmv\"]','4550','Paid','Treatment Assigned','2025-05-03','Cash'),('UIzUTLoCz7','ASTCRLvSD7','2025-08-02','Pain in teeth','[\"jChBSxtliq\",\"9lTojSgx7h\"]','850','Paid','Treatment Assigned','2025-08-02','Cash'),('VAnkDQ0Nqk','CqwWFZDlQv','2025-05-03','Teeth Pain','[\"jChBSxtliq\",\"2Zf7F3qhmv\",\"9lTojSgx7h\"]','4850','Paid','Treatment Assigned','2025-05-03','Cash'),('woq6iPeCWf','eFJnNywunz','2025-09-29','Infection in mouth','[\"jChBSxtliq\",\"2Zf7F3qhmv\"]','4550','Paid','Treatment Assigned','2025-09-29','Cash'),('wrdUafv8bK','NbmtylWOsV','2025-10-09','Teeth Ache Abul','[]','50','Paid','Treatment Assigned','2025-10-09','Cash'),('xZxDHlhvdv','eFJnNywunz','2025-10-11','Un Paid Testing','[]','50','Paid','Treatment Assigned','2025-10-11','Cash'),('ywavGtFiEl','ASTCRLvSD7','2025-09-11','Teeth Ache Shamsiya','[]','','Paid',NULL,NULL,'Card');
/*!40000 ALTER TABLE `cheif_complaint` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cheif_complaints`
--

DROP TABLE IF EXISTS `cheif_complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cheif_complaints` (
  `cheif_complaint_id` varchar(20) NOT NULL,
  `issue_reported` varchar(100) DEFAULT NULL,
  `reported_date` datetime DEFAULT NULL,
  `complaint_charges` bigint(20) DEFAULT NULL,
  `total_treatment_charges` bigint(20) DEFAULT NULL,
  `payment_status` varchar(15) DEFAULT NULL,
  `patient_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`cheif_complaint_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cheif_complaints`
--

LOCK TABLES `cheif_complaints` WRITE;
/*!40000 ALTER TABLE `cheif_complaints` DISABLE KEYS */;
/*!40000 ALTER TABLE `cheif_complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `dept_id` varchar(50) NOT NULL,
  `dept_name` varchar(50) DEFAULT NULL,
  `hodname` varchar(50) DEFAULT NULL,
  `dept_username` varchar(50) DEFAULT NULL,
  `dept_password` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES ('18MIA4AsbJ','OMDR','Shayban','omdr@gmail.com','VGVzdDEyM0A='),('aK8JyQl9Ph','Prosthodontics and Crown & Bridge','Shamsiya Khan','pcb@gmail.com','VGVzdDEyM0A='),('G937M6ymmh','Conservative Dentistry & Endodontics','Shamsiya','cde@gmail.com','VGVzdDEyM0A='),('onLkfHiee1','Public Health Dentistry','Shayban','public_health_dentistry@gmail.com','VGVzdDEyM0A='),('zxSaD33OW0','Test Department','JAved khan','javed@gmail.com','VGVzdDEyM0A=');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diagnose`
--

DROP TABLE IF EXISTS `diagnose`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `diagnose` (
  `diagnose_id` varchar(50) NOT NULL,
  `diagnose_date` date DEFAULT NULL,
  `treatment_suggested` varchar(50) DEFAULT NULL,
  `next_appointment_date` date DEFAULT NULL,
  `medicine` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`medicine`)),
  PRIMARY KEY (`diagnose_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diagnose`
--

LOCK TABLES `diagnose` WRITE;
/*!40000 ALTER TABLE `diagnose` DISABLE KEYS */;
/*!40000 ALTER TABLE `diagnose` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `doctor_id` varchar(50) NOT NULL,
  `fullname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `experience` int(11) DEFAULT NULL,
  `degree` varchar(200) DEFAULT NULL,
  `phone_no` mediumtext DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `marital_status` varchar(10) DEFAULT NULL,
  `dept_id` varchar(50) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `qualification` varchar(50) DEFAULT NULL,
  `specialization` varchar(50) DEFAULT NULL,
  `biography` varchar(50) DEFAULT NULL,
  `onboarding_status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`doctor_id`),
  UNIQUE KEY `email` (`email`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES ('hhXzom63ja','Jawed Khan','jawedkhan@azamcampus.org','Test123@',NULL,NULL,'7994561230','Camp','Single','18MIA4AsbJ','Male',NULL,NULL,NULL,NULL,0),('HvFPme64n6','Khan Shayban','shaybankhan@gmail.com','Test123@',5,'MBBS','8149863141','Camp','Single','onLkfHiee1','Male','1999-10-23','Abcd','Abcd','Abcd',1),('Jvngj9vAnE','Javed Khan','javedkhan@azamcampus.com','Test123@',NULL,NULL,'7894561230','Camp','Single','18MIA4AsbJ','Male',NULL,NULL,NULL,NULL,0),('MRItIM1mFH','shayban khan (test)','shaybankhan12345@gmail.com','Test123@',3,'MBBS','8149863141','Camp','Single','18MIA4AsbJ','Male','1999-10-23','','','',1),('oxNDA1angm','Shamsiya Khan','shamsiyadoc@gmail.com','Test123@',3,'MBBS','7841849748','Kharadi','Single','18MIA4AsbJ','Female','1997-04-27','Dentist','Dentist','Abcd',1),('qQfzfvFKVd','Jawed Khan','jawedkhan@azamcampus.com','Test123@',NULL,NULL,'7894561230','Camp','Single','18MIA4AsbJ','Male',NULL,NULL,NULL,NULL,0),('yfsjeIoLO1','Shayban Khan','shaybandoc@gmail.com','Test123@',5,'Mbbs','7894561230','Camp','Single','18MIA4AsbJ','Male','1999-10-23','Dentist','-','-',1);
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` varchar(20) NOT NULL,
  `payment_date` datetime NOT NULL,
  `payment_amount` decimal(10,2) NOT NULL,
  `payment_type` enum('Cash','UPI','Card') NOT NULL,
  `payment_status` enum('Success','Pending','Failed') DEFAULT 'Pending',
  `transaction_id` varchar(50) DEFAULT NULL,
  `upi_app` varchar(20) DEFAULT NULL,
  `card_last4` varchar(4) DEFAULT NULL,
  `treatment_id` varchar(20) DEFAULT NULL,
  `complaint_id` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`payment_id`),
  KEY `treatment_id` (`treatment_id`),
  KEY `complaint_id` (`complaint_id`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`treatment_id`) REFERENCES `treatment_details` (`treatment_id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`complaint_id`) REFERENCES `cheif_complaint` (`complaint_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription` (
  `prescription_id` varchar(20) NOT NULL,
  `treatment_id` varchar(20) DEFAULT NULL,
  `prescription_date` date NOT NULL,
  `doctor_notes` varchar(500) DEFAULT NULL,
  `appointment_id` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`prescription_id`),
  KEY `treatment_id` (`treatment_id`),
  KEY `fk_prescription_appointment` (`appointment_id`),
  CONSTRAINT `fk_prescription_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`appointment_id`),
  CONSTRAINT `prescription_ibfk_1` FOREIGN KEY (`treatment_id`) REFERENCES `treatment_details` (`treatment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription`
--

LOCK TABLES `prescription` WRITE;
/*!40000 ALTER TABLE `prescription` DISABLE KEYS */;
INSERT INTO `prescription` VALUES ('GBat6EI9UF','hZYpf3OrXJ','2025-10-11','abvd','9B6rOL7aCY'),('JOtloYb0xQ','1QrY8VLkjx','2025-10-11','rooz dawa loo','G2HKTYkt4h'),('kmDPeBC3LT','DODXiBSvF5','2025-10-11','Dyaan rakho','K0XxYX4AMZ'),('LGsHatglMv','e8ntlewsEy','2025-10-11','Take proper care','uZGmowyQln'),('oeNAFiEkmR','sOu1c5pAa2','2025-10-11','tc','HsCGJVyXSS'),('qhuIjh12y','Q5nCm1O3BG','2025-10-10','Everything is fine for now',NULL),('XBg2cKYnFO','tkpjvVT0qc','2025-10-11','We didnt find anything serious its a minor issue will be resolved','PfDchBWIru');
/*!40000 ALTER TABLE `prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription_details`
--

DROP TABLE IF EXISTS `prescription_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription_details` (
  `prescription_detail_id` int(11) NOT NULL AUTO_INCREMENT,
  `prescription_id` varchar(20) DEFAULT NULL,
  `medication_name` varchar(100) NOT NULL,
  `dosage` varchar(50) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `frequency` varchar(100) NOT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `instructions` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`prescription_detail_id`),
  KEY `prescription_id` (`prescription_id`),
  CONSTRAINT `prescription_details_ibfk_1` FOREIGN KEY (`prescription_id`) REFERENCES `prescription` (`prescription_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription_details`
--

LOCK TABLES `prescription_details` WRITE;
/*!40000 ALTER TABLE `prescription_details` DISABLE KEYS */;
INSERT INTO `prescription_details` VALUES (1,'qhuIjh12y','Amoxicillin','500mg',14,'Twice Daily','7 days','Take until finished.'),(3,'qhuIjh12y','Ibuprofen','200mg',20,'Every 6 hours as needed','5 days','Take with food for pain.'),(4,'XBg2cKYnFO','Crocin','500mg',8,'Twice Daily','10 days','Take Until fisnished'),(5,'XBg2cKYnFO','omez','40mg',2,'Once Daily','4 days','whenever necessary'),(6,'JOtloYb0xQ','Crocuin','500mg',14,'Daily','5','loo'),(7,'LGsHatglMv','Crocin','500mg',1,'4','5 days',''),(8,'GBat6EI9UF','crocin','500mg',10,'10 days','10 days','NAD'),(9,'kmDPeBC3LT','crocin fareeha shamsoua','500mg',10,'twice daily','5 dayas','after food'),(10,'oeNAFiEkmR','crocin','500mg',15,'twice','5','afer fkkd');
/*!40000 ALTER TABLE `prescription_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test` (
  `test_id` int(11) NOT NULL AUTO_INCREMENT,
  `test_name` varchar(50) DEFAULT NULL,
  `test_price` bigint(20) DEFAULT NULL,
  `test_date` date DEFAULT NULL,
  `userid` varchar(50) DEFAULT NULL,
  `referred_dept` varchar(50) DEFAULT NULL,
  `complain_id` varchar(50) DEFAULT NULL,
  `report_status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`test_id`),
  KEY `userid` (`userid`),
  KEY `referred_dept` (`referred_dept`),
  CONSTRAINT `test_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE,
  CONSTRAINT `test_ibfk_2` FOREIGN KEY (`referred_dept`) REFERENCES `department` (`dept_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
INSERT INTO `test` VALUES (9,'X_RAY',500,'2025-05-03','rzTxzmukVa','18MIA4AsbJ','oS9PNmI5lz','In process'),(10,'Dental Crown (PFM)',4000,'2025-05-03','rzTxzmukVa','18MIA4AsbJ','oS9PNmI5lz','In process'),(11,'X_RAY',500,'2025-05-03','CqwWFZDlQv','18MIA4AsbJ','Q98GGp7Ozr','In process'),(12,'Dental Crown (PFM)',4000,'2025-05-03','CqwWFZDlQv','18MIA4AsbJ','Q98GGp7Ozr','In process'),(13,'X_RAY',500,'2025-05-03','CqwWFZDlQv','18MIA4AsbJ','VAnkDQ0Nqk','In process'),(14,'Dental Crown (PFM)',4000,'2025-05-03','CqwWFZDlQv','18MIA4AsbJ','VAnkDQ0Nqk','In process'),(15,'Dental Cavity Checkup',300,'2025-05-03','CqwWFZDlQv','18MIA4AsbJ','VAnkDQ0Nqk','In process'),(16,'X_RAY',500,'2025-05-03','eFJnNywunz','18MIA4AsbJ','u3IWhlIs4J','In process'),(17,'Dental Crown (PFM)',4000,'2025-05-03','eFJnNywunz','18MIA4AsbJ','u3IWhlIs4J','In process'),(18,'X_RAY',500,'2025-05-03','FRaTT5t8b1','18MIA4AsbJ','qwV9bP2ZcS','In process'),(19,'Dental Cavity Checkup',300,'2025-05-03','FRaTT5t8b1','18MIA4AsbJ','qwV9bP2ZcS','In process'),(20,'X_RAY',500,'2025-05-03','ZRGdofLkTS','18MIA4AsbJ','6FOMrch1e1','In process'),(21,'X_RAY',500,'2025-05-03','ZRGdofLkTS','18MIA4AsbJ','5RI3HaMZ9t','In process'),(22,'X_RAY',500,'2025-05-03','ZRGdofLkTS','18MIA4AsbJ','03lriMApal','In process'),(23,'X_RAY',500,'2025-08-02','ASTCRLvSD7','18MIA4AsbJ','UIzUTLoCz7','In process'),(24,'Dental Cavity Checkup',300,'2025-08-02','ASTCRLvSD7','18MIA4AsbJ','UIzUTLoCz7','In process'),(25,'X_RAY',500,'2025-08-02','ASTCRLvSD7','18MIA4AsbJ','I2llJCuhxO','In process'),(26,'X_RAY',500,'2025-08-03','ASTCRLvSD7','18MIA4AsbJ','AiXCRL6WOu','In process'),(27,'X_RAY',500,'2025-08-06','ASTCRLvSD7','18MIA4AsbJ','NzoAvS79Ay','In process'),(28,'X_RAY',500,'2025-08-23','ASTCRLvSD7','18MIA4AsbJ','AxxeUco0LQ','In process'),(29,'X_RAY',500,'2025-09-11','ASTCRLvSD7','18MIA4AsbJ','Is7N7Cietz','In process'),(30,'X_RAY',500,'2025-09-29','eFJnNywunz','18MIA4AsbJ','11TUd1volv','In process'),(31,'Dental Crown (PFM)',4000,'2025-09-29','eFJnNywunz','18MIA4AsbJ','11TUd1volv','In process'),(32,'X_RAY',500,'2025-09-29','eFJnNywunz','18MIA4AsbJ','MoVvlidjrx','In process'),(33,'Dental Crown (PFM)',4000,'2025-09-29','eFJnNywunz','18MIA4AsbJ','MoVvlidjrx','In process'),(34,'X_RAY',500,'2025-09-29','eFJnNywunz','18MIA4AsbJ','aCOeDDtQKR','In process'),(35,'Dental Crown (PFM)',4000,'2025-09-29','eFJnNywunz','18MIA4AsbJ','aCOeDDtQKR','In process'),(36,'X_RAY',500,'2025-09-29','eFJnNywunz','18MIA4AsbJ','mHTBSTpEtU','In process'),(37,'X_RAY',500,'2025-09-29','eFJnNywunz','18MIA4AsbJ','woq6iPeCWf','In process'),(38,'Dental Crown (PFM)',4000,'2025-09-29','eFJnNywunz','18MIA4AsbJ','woq6iPeCWf','In process');
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_reports`
--

DROP TABLE IF EXISTS `test_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `test_reports` (
  `report_id` int(11) NOT NULL AUTO_INCREMENT,
  `test_id` int(11) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`report_id`),
  KEY `test_id` (`test_id`),
  CONSTRAINT `test_reports_ibfk_1` FOREIGN KEY (`test_id`) REFERENCES `test` (`test_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_reports`
--

LOCK TABLES `test_reports` WRITE;
/*!40000 ALTER TABLE `test_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment`
--

DROP TABLE IF EXISTS `treatment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment` (
  `treatment_id` varchar(50) NOT NULL,
  `treatment_name` varchar(50) DEFAULT NULL,
  `treatment_start_date` datetime DEFAULT NULL,
  `treatment_end_date` datetime DEFAULT NULL,
  `findings` varchar(100) DEFAULT NULL,
  `prescription` varchar(50) DEFAULT NULL,
  `treatment_sequence` int(11) DEFAULT NULL,
  `treatment_charges` decimal(8,2) DEFAULT NULL,
  `treatment_status` varchar(15) DEFAULT NULL,
  `treatment_payment_status` varchar(15) DEFAULT NULL,
  `categoriezed_treatment` tinyint(1) DEFAULT NULL,
  `main_treatment` varchar(20) DEFAULT NULL,
  `dept_id` varchar(50) DEFAULT NULL,
  `cheif_complaint_id` varchar(20) DEFAULT NULL,
  `doctor_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`treatment_id`),
  KEY `dept_id` (`dept_id`),
  KEY `cheif_complaint_id` (`cheif_complaint_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `treatment_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`),
  CONSTRAINT `treatment_ibfk_2` FOREIGN KEY (`cheif_complaint_id`) REFERENCES `cheif_complaints` (`cheif_complaint_id`),
  CONSTRAINT `treatment_ibfk_3` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`doctor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment`
--

LOCK TABLES `treatment` WRITE;
/*!40000 ALTER TABLE `treatment` DISABLE KEYS */;
/*!40000 ALTER TABLE `treatment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment_chart`
--

DROP TABLE IF EXISTS `treatment_chart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment_chart` (
  `treatment_id` varchar(20) NOT NULL,
  `treatment_name` varchar(100) NOT NULL,
  `total_charges` decimal(10,2) NOT NULL,
  `dept_id` varchar(20) DEFAULT NULL,
  `had_sub_category` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`treatment_id`),
  KEY `dept_id` (`dept_id`),
  CONSTRAINT `treatment_chart_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment_chart`
--

LOCK TABLES `treatment_chart` WRITE;
/*!40000 ALTER TABLE `treatment_chart` DISABLE KEYS */;
INSERT INTO `treatment_chart` VALUES ('3YQoOv0h2r','Maryland Bridge',10500.00,'aK8JyQl9Ph',1),('4kqIxhACi2','Zirconia Crown',15000.00,'aK8JyQl9Ph',1),('4LzAEoXY1O','Dental Bridge',18000.00,'aK8JyQl9Ph',1),('6KadXL0Teq','Full Mouth Rehabilitation',55000.00,'aK8JyQl9Ph',1),('Beq0WpQxcx','Treatment Root Canal',52500.00,'aK8JyQl9Ph',1),('EFzsMzr46o','Cantilever Bridge',11000.00,'aK8JyQl9Ph',1),('mEzHDi3Gd2','Temporary Bridge',4500.00,'aK8JyQl9Ph',1),('qOk9uBbQxb','Management of oral precancerous conditions',650.00,'18MIA4AsbJ',0),('w4dYKcknks','PFM Crown',8500.00,'aK8JyQl9Ph',1),('Xl9xSdCUNx','Implant-Supported Crown',22000.00,'aK8JyQl9Ph',1);
/*!40000 ALTER TABLE `treatment_chart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment_details`
--

DROP TABLE IF EXISTS `treatment_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment_details` (
  `treatment_id` varchar(50) NOT NULL,
  `treatment_name` varchar(50) DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `total_charges` mediumtext DEFAULT NULL,
  `finding` varchar(50) DEFAULT NULL,
  `history` varchar(50) DEFAULT NULL,
  `dept_id` varchar(50) DEFAULT NULL,
  `patientid` varchar(50) DEFAULT NULL,
  `doctorid` varchar(50) DEFAULT NULL,
  `complaint_id` varchar(50) DEFAULT NULL,
  `payment_status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`treatment_id`),
  KEY `dept_id` (`dept_id`),
  KEY `patientid` (`patientid`),
  KEY `doctorid` (`doctorid`),
  KEY `fk_complaint_id` (`complaint_id`),
  CONSTRAINT `fk_complaint_id` FOREIGN KEY (`complaint_id`) REFERENCES `cheif_complaint` (`complaint_id`),
  CONSTRAINT `treatment_details_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`),
  CONSTRAINT `treatment_details_ibfk_2` FOREIGN KEY (`patientid`) REFERENCES `user` (`userid`) ON DELETE CASCADE,
  CONSTRAINT `treatment_details_ibfk_3` FOREIGN KEY (`doctorid`) REFERENCES `user` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment_details`
--

LOCK TABLES `treatment_details` WRITE;
/*!40000 ALTER TABLE `treatment_details` DISABLE KEYS */;
INSERT INTO `treatment_details` VALUES ('1QrY8VLkjx','Management of oral precancerous conditions','2025-10-11','Assigned','650','Dimag issue','dsdad','18MIA4AsbJ','NbmtylWOsV',NULL,'k378sxj50m','Paid'),('1TPbFlxTQo','Teeth Whitening','2025-05-02','In Process',NULL,'','','aK8JyQl9Ph','ZRGdofLkTS',NULL,'03lriMApal','Paid'),('6CpIh13Zcm','Management of oral precancerous conditions','2025-10-10','Assigned','650','teeth sensessss','','18MIA4AsbJ','NbmtylWOsV',NULL,'STZilUBLtf','Paid'),('6mlev8n5h7','Management of oral precancerous conditions','2025-09-28','Assigned','650','Nothing','Abcd','18MIA4AsbJ','eFJnNywunz',NULL,'woq6iPeCWf','Paid'),('972ipWolWg','Management of oral precancerous conditions','2025-09-11','Assigned','650','We had find an issue where we had seen that the ca','no history','18MIA4AsbJ','CqwWFZDlQv',NULL,'PzuGm14VF9','Paid'),('998uZsaSsv','Teeth Cleaning','2025-05-02','In Process',NULL,'','','aK8JyQl9Ph','ZRGdofLkTS',NULL,'5RI3HaMZ9t','Paid'),('BD3zt3DxlS','Management of oral precancerous conditions','2025-10-08','Assigned','650','','','18MIA4AsbJ','NbmtylWOsV',NULL,'wrdUafv8bK','Paid'),('DkaohLYSyJ','Management of oral precancerous conditions','2025-09-18','Assigned','650','Abcd','aBCD','18MIA4AsbJ','ZRGdofLkTS',NULL,'AvuBY7fyRt','Paid'),('DODXiBSvF5','Management of oral precancerous conditions','2025-10-11','completed','650','pain','nothin','18MIA4AsbJ','NbmtylWOsV',NULL,'jAqxxxueLR','Paid'),('DXdJVLFcPV','Testh Implant','2025-08-05','In Process',NULL,'','',NULL,'ASTCRLvSD7',NULL,'NzoAvS79Ay',''),('e8ntlewsEy','Management of oral precancerous conditions','2025-10-10','completed','650','Infection in teeth','Nothing','18MIA4AsbJ','NbmtylWOsV',NULL,'Dq1upj1nMB','Paid'),('hZYpf3OrXJ','Management of oral precancerous conditions','2025-10-11','completed','650','abcd','abcd','18MIA4AsbJ','NbmtylWOsV',NULL,'6j9XrhoZij','Paid'),('IJHntk0O4C','Teeth Pai','2025-05-02','Assigned',NULL,'','','18MIA4AsbJ','eFJnNywunz',NULL,'u3IWhlIs4J','Paid'),('iUbsFDiGAQ','Management of oral precancerous conditions','2025-10-10','Assigned','650','None','','18MIA4AsbJ','FRaTT5t8b1',NULL,'2kHMuwEbr1','Paid'),('kEx4uQdbsw','Teeth Whitening','2025-05-13','In Process',NULL,'','','aK8JyQl9Ph','ZRGdofLkTS',NULL,'0zvOZcaNpi','Paid'),('KXxwXMVhKk','Pain in teeth','2025-08-01','In Process','850','Abcd','Abcd','aK8JyQl9Ph','ASTCRLvSD7',NULL,'UIzUTLoCz7','Paid'),('L6hIpSWu83','Management of oral precancerous conditions','2025-09-11','Assigned','650','Canal Failed procedure','no history','18MIA4AsbJ','eFJnNywunz',NULL,'8IHOD7QyAP','UnPaid'),('lMoGzMy36X','teeeth Cleaning','2025-05-02','In Process',NULL,'','',NULL,'ZRGdofLkTS',NULL,'6FOMrch1e1','Paid'),('PBwvvHraP3','Management of oral precancerous conditions','2025-09-11','Assigned','650','','','18MIA4AsbJ','eFJnNywunz',NULL,'mvtnpRjQwe','Paid'),('PI4BbGHRnj','Zirconia Crown','2025-09-15','In Process','15000','Abcd','-','aK8JyQl9Ph','eFJnNywunz',NULL,'02Gl3CGMyT','Paid'),('Q5nCm1O3BG','Management of oral precancerous conditions','2025-10-05','Assigned','650','','','18MIA4AsbJ','NbmtylWOsV',NULL,'1Qmx6jB4mV','Paid'),('qPnLyJl9ZV','Teeth Pain','2025-05-02','In Process','5000','','','G937M6ymmh','CqwWFZDlQv',NULL,'VAnkDQ0Nqk','Paid'),('sOu1c5pAa2','Management of oral precancerous conditions','2025-10-11','completed','650','test','test','18MIA4AsbJ','NbmtylWOsV',NULL,'QYHv5gYw6c','Paid'),('tkpjvVT0qc','Management of oral precancerous conditions','2025-10-11','Assigned','650','Teeth infection','None','18MIA4AsbJ','NbmtylWOsV',NULL,'jvj7gCyRnH','Paid'),('tmZnugtLv5','Zirconia Crown','2025-09-15','In Process','15000','teeth sad gye','no','aK8JyQl9Ph','eFJnNywunz',NULL,'l3kIgupUbU','Paid'),('TZKnobjbOH','Full Mouth Rehabilitation','2025-09-10','In Process','55000','Very Bad condition of teeth','No history','aK8JyQl9Ph','ASTCRLvSD7',NULL,'6UMWH0GB8I','Paid'),('uMMKcgvbi1','Management of oral precancerous conditions','2025-10-05','Assigned','650','','','18MIA4AsbJ','NbmtylWOsV',NULL,'p9GCyk4pgw','Paid'),('VetHoypDvo','Root canal','2025-05-02','In Process','10000','','','aK8JyQl9Ph','FRaTT5t8b1',NULL,'qwV9bP2ZcS','Paid'),('wT2vL0S5Qa','Teeth removal','2025-08-01','Assigned','550','Abcd','abcd','18MIA4AsbJ','ASTCRLvSD7',NULL,'I2llJCuhxO','Paid'),('yHb5vTOFF7','Management of oral precancerous conditions','2025-10-11','In Process','650','Abcd','Abcd','18MIA4AsbJ','eFJnNywunz',NULL,'xZxDHlhvdv','UnPaid');
/*!40000 ALTER TABLE `treatment_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment_master`
--

DROP TABLE IF EXISTS `treatment_master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment_master` (
  `treatment_id` varchar(50) DEFAULT NULL,
  `treatment_name` varchar(50) DEFAULT NULL,
  `treatment_price` mediumtext DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  `dept_id` varchar(50) DEFAULT NULL,
  KEY `fk_treatment_dept` (`dept_id`),
  CONSTRAINT `fk_treatment_dept` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment_master`
--

LOCK TABLES `treatment_master` WRITE;
/*!40000 ALTER TABLE `treatment_master` DISABLE KEYS */;
INSERT INTO `treatment_master` VALUES ('jChBSxtliq','X_RAY','500','test','18MIA4AsbJ'),('2Zf7F3qhmv','Dental Crown (PFM)','4000','test','18MIA4AsbJ'),('9lTojSgx7h','Dental Cavity Checkup','300','test','18MIA4AsbJ'),('8Iwe2n59ZH','CBCT Scan (Cone Beam CT)','5000','test','18MIA4AsbJ'),('LHr7eV9wXe','Tooth Sensitivity Test','150','test','18MIA4AsbJ'),('he9RLkn61m','Pulp Vitality Test','600','test','18MIA4AsbJ'),('oE3LuUD5BD','Root Canal','8000','treatment','G937M6ymmh'),('lXOSRap2h5','Dental Bridge',NULL,NULL,NULL),('GYoMcqUDwf','Dental Bridge',NULL,NULL,NULL);
/*!40000 ALTER TABLE `treatment_master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatment_subcategory`
--

DROP TABLE IF EXISTS `treatment_subcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatment_subcategory` (
  `sub_id` varchar(20) NOT NULL,
  `treatment_id` varchar(20) DEFAULT NULL,
  `step_name` varchar(100) NOT NULL,
  `step_charges` decimal(10,2) NOT NULL,
  `step_sequence` int(11) DEFAULT NULL,
  PRIMARY KEY (`sub_id`),
  KEY `treatment_id` (`treatment_id`),
  CONSTRAINT `treatment_subcategory_ibfk_1` FOREIGN KEY (`treatment_id`) REFERENCES `treatment_chart` (`treatment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatment_subcategory`
--

LOCK TABLES `treatment_subcategory` WRITE;
/*!40000 ALTER TABLE `treatment_subcategory` DISABLE KEYS */;
INSERT INTO `treatment_subcategory` VALUES ('05i8c2L6fV','4LzAEoXY1O','Final Bridge Cementation',14000.00,3),('0ZzbGlNNmv','Xl9xSdCUNx','Implant Placement',12000.00,1),('1HEECCUMdY','w4dYKcknks','Tooth Preparation',1500.00,1),('2faYAsSSgv','Beq0WpQxcx','Filling',50000.00,2),('39fS4CHdDt','Xl9xSdCUNx','Abutment Fixing',4000.00,2),('3JOe6SBRJ2','4LzAEoXY1O','Abutment Tooth Preparation',1000.00,1),('7oLB5NRFhq','w4dYKcknks','Impression Taking',1000.00,2),('9bfv2k7ZC0','EFzsMzr46o','Single Abutment Prep',3500.00,1),('aYGpcarBt2','4kqIxhACi2','Zirconia Milling & Finishing',6000.00,4),('C0KM20ycyg','6KadXL0Teq','Initial Assessment & Diagnostic Casts',5000.00,1),('EGoVZ2WRC9','3YQoOv0h2r','Preparation of Adjacent Teeth',3000.00,1),('FHiopfD7tw','6KadXL0Teq','Occlusal Plane Analysis',7000.00,2),('i15sacPC4u','EFzsMzr46o','Cementing the Bridge',3000.00,3),('iutWsJqvLT','mEzHDi3Gd2','Placement and Adjustment',1000.00,3),('KnfnhJbVCd','3YQoOv0h2r','Bridge Placement',5500.00,3),('KoBvyefD0c','4kqIxhACi2','Digital Impression',3000.00,2),('kXZij2lM9n','6KadXL0Teq','Temporary Restorations',10000.00,3),('LvakMNNlGd','mEzHDi3Gd2','Bridge Fabrication',2500.00,2),('mAFqNpnTvw','3YQoOv0h2r','Wing Attachment Design',2000.00,2),('nZWlJjYfQM','4kqIxhACi2','Tooth Preparation',2000.00,1),('qtVFbQFvbT','EFzsMzr46o','Bridge Fabrication',4500.00,2),('QZoX4vPPdD','6KadXL0Teq','Post-Op Follow-Up & Adjustments',8000.00,5),('RXWCwEcJqN','mEzHDi3Gd2','Initial Impression',1000.00,1),('swRNnYfW3s','4kqIxhACi2','CAD/CAM Design',2000.00,3),('TyUbpIi8Qg','4kqIxhACi2','Final Cementation',2000.00,5),('V09FCEtUxx','Xl9xSdCUNx','Crown Attachment',6000.00,3),('vJxnOe2KnK','Beq0WpQxcx','Cleaning',2500.00,1),('vYURBtzhOV','w4dYKcknks','Final Crown Cementation',5000.00,4),('WMcT6f0Dcp','w4dYKcknks','Temporary Crown',1000.00,3),('Z930rzgdsm','4LzAEoXY1O','Bridge Framework Design',3000.00,2),('ZYOptz6R2Q','6KadXL0Teq','Final Prosthesis Fabrication',25000.00,4);
/*!40000 ALTER TABLE `treatment_subcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userid` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `fullname` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `marital_status` varchar(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `phone` mediumtext DEFAULT NULL,
  `emergency_contact` mediumtext DEFAULT NULL,
  `emergency_name` varchar(50) DEFAULT NULL,
  `registration_payment_type` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('1IEMBxcq5e','shaybanaccounts@gmail.com','VGVzdDEyM0A=','SHAYBAN SALIM KHAN','470/2,center Street opp qureshi mosque','Male','Single','1999-10-23','Accountant','08149863141','8208647407','8208647407',NULL),('ASTCRLvSD7','sehrozk@gmail.com','VGVzdDEyM0A=','Shamsiya Sehroz Barkat Ali Khan','Kharadi','Femake','','2025-04-27','Patient','7894561230','8149863141','Shayban','Cash'),('CqwWFZDlQv','shamsiya1@kalpas.in','Vm10a1YyVnRVa1ZTV0d4T1RVVkZPUT09','Shamsiya khan','Camp pune','Female','Single','1999-04-24','Patient','7841849748','8149863141','Shayban Khan','Online'),('eFJnNywunz','abul@gmail.com','VGVzdDEyM0A=','Abul fazal','Kondwa','Male','Married','2004-02-17','patient','9876543210','9876543210','Shayban',NULL),('FRaTT5t8b1','shaybankhan@gmail.com','VGVzdDEyM0A=','Shayban Khan','Camp center street','Female','','1974-06-01','Patient','+918149863141','7841849749','Shamsiya Khan','UPI'),('NbmtylWOsV','malik123@gmail.com','VGVzdDEyM0A=','Malik Abul Ahmad ','kausar baug','Female','','2025-10-05','Patient','9876543210','9922446633','Abul fazl','Cash'),('qlSwZhbGGG','malik@gmail.com','VGVzdDEyM0A=','Malik Ahmed','lucknow','Male','Single','1999-10-23','Clerk','9527789211','8149863141','Shayban Khan',NULL),('rzTxzmukVa','shamsiya@gmail.com','VGVzdDEyM0A=','Shamsiya Khan','Kharadi','Female','Single','1999-04-27','patient','9898989898','978654321','shayban',NULL),('ZRGdofLkTS','shamsiya@kalpas.in','VGVzdDEyM0A=','Shamsiya khan','Kharadi','Female','Single','1999-04-27','Patient','7841849748','8149863141','Shayban Khan','Online');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'dental'
--

--
-- Dumping routines for database 'dental'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-21 20:18:09
