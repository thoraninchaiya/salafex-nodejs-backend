-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.25 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6337
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for salafex
CREATE DATABASE IF NOT EXISTS `salafex` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `salafex`;

-- Dumping structure for table salafex.carousel
CREATE TABLE IF NOT EXISTS `carousel` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','unactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table salafex.carousel: ~7 rows (approximately)
DELETE FROM `carousel`;
/*!40000 ALTER TABLE `carousel` DISABLE KEYS */;
INSERT INTO `carousel` (`id`, `name`, `image`, `status`) VALUES
	(1, NULL, 'e6be21a080be2a0bfa8ba12e6a9a9f5a.jpg', 'active'),
	(2, NULL, '0e889333035e0ab4ee07dad29ced6ef7.jpg', 'active'),
	(3, NULL, '09c78672f841624913867b21dfccdf0f.jpg', 'active'),
	(4, NULL, '70ed06b513835f1200f483f5ba19f940.jpg', 'active'),
	(5, NULL, '75f189ad04490c45abe05553ba9dbc31.jpg', 'active'),
	(6, NULL, '867071047dc07827bb0ee8d522e89223.jpg', 'active'),
	(7, NULL, '1f0d39d58294f26174633519d66405b8.png', 'active');
/*!40000 ALTER TABLE `carousel` ENABLE KEYS */;

-- Dumping structure for table salafex.cart
CREATE TABLE IF NOT EXISTS `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `product_id` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cart_qty` int DEFAULT NULL,
  `cart_status` enum('pending','success') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'pending',
  `cart_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cart_id`) USING BTREE,
  KEY `user` (`users_id`),
  KEY `product` (`product_id`),
  CONSTRAINT `product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `user` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table salafex.cart: ~3 rows (approximately)
DELETE FROM `cart`;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` (`cart_id`, `users_id`, `product_id`, `cart_qty`, `cart_status`, `cart_date`) VALUES
	(2, 1, 'M101', 30, 'pending', '2021-09-11 20:55:24'),
	(3, 1, 'M102', 1, 'pending', '2021-09-12 06:44:33'),
	(4, 1, 'M108', 2, 'pending', '2021-09-12 06:44:52'),
	(5, 1, 'M107', 3, 'pending', '2021-09-12 22:38:14');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;

-- Dumping structure for table salafex.category
CREATE TABLE IF NOT EXISTS `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name_eng` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('active','unactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'active',
  `dtails` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `create_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table salafex.category: ~6 rows (approximately)
DELETE FROM `category`;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` (`id`, `name`, `name_eng`, `status`, `dtails`, `create_at`) VALUES
	(1, 'แมส', 'mask', 'active', NULL, '2021-07-27 10:58:54'),
	(2, 'เสื้อ', '', 'active', NULL, '2021-08-12 13:29:06'),
	(3, 'เคสโทรศัพท์', '', 'active', NULL, '2021-08-12 13:30:27'),
	(4, 'กางเกง', '', 'active', NULL, '2021-08-12 13:32:37'),
	(5, 'แก้วน้ำ', '', 'active', NULL, '2021-08-12 13:33:13'),
	(6, 'ปลอกแขน', '', 'active', NULL, '2021-08-12 13:33:29'),
	(7, 'กล่องสุ่ม', NULL, 'active', NULL, '2021-08-12 13:36:58');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

-- Dumping structure for table salafex.order
CREATE TABLE IF NOT EXISTS `order` (
  `id` int NOT NULL DEFAULT '0',
  `users_id` int DEFAULT NULL,
  `serial` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `datetime` int DEFAULT NULL,
  `status` enum('success','panding') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table salafex.order: ~0 rows (approximately)
DELETE FROM `order`;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;

-- Dumping structure for table salafex.order_detail
CREATE TABLE IF NOT EXISTS `order_detail` (
  `id` int DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `qty` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- Dumping data for table salafex.order_detail: ~1 rows (approximately)
DELETE FROM `order_detail`;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` (`id`, `order_id`, `product_id`, `qty`) VALUES
	(NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;

-- Dumping structure for table salafex.product
CREATE TABLE IF NOT EXISTS `product` (
  `secretid` int NOT NULL AUTO_INCREMENT,
  `id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `category_id` int NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `cost` int NOT NULL,
  `price` int NOT NULL,
  `product_qty` int NOT NULL,
  `testqty` int NOT NULL,
  `status` enum('active','unactive') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'active',
  `image` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `registering` enum('false','true') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'false',
  PRIMARY KEY (`secretid`) USING BTREE,
  KEY `category` (`category_id`) USING BTREE,
  KEY `id` (`id`),
  CONSTRAINT `category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table salafex.product: ~10 rows (approximately)
DELETE FROM `product`;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` (`secretid`, `id`, `category_id`, `name`, `cost`, `price`, `product_qty`, `testqty`, `status`, `image`, `details`, `create_at`, `registering`) VALUES
	(1, 'M101', 1, 'salafex basic mask redblack', 200, 490, 91, 9, 'active', 'be02f7ec07ae4be1a8d516ce8e42fd69.jpg', NULL, '2021-07-27 11:00:07', 'false'),
	(2, 'M102', 4, 'salafex X art wall shorts', 990, 1490, 100, 0, 'active', '6adfdcb7698a10043437cf059f6260ea.jpg', NULL, '2020-08-06 11:00:07', 'false'),
	(3, 'M103', 2, 'salafex Alien wears tee limited edition', 1500, 2490, 100, 0, 'active', '962adc477d191c34e666700f58886fb2.jpg', NULL, '2021-08-12 13:27:25', 'false'),
	(4, 'M104', 5, 'Salafex Cooler flask', 450, 790, 100, 0, 'active', '9a42fdc324d405ba401c6270007736f6.jpg', NULL, '2021-08-12 13:45:34', 'false'),
	(5, 'M105', 6, 'Salafex arm sleeve', 500, 800, 100, 0, 'active', '5c48ca360acc8724510b0851696f5924.jpg', NULL, '2021-08-12 13:48:50', 'false'),
	(6, 'M106', 7, 'salafex mystery box', 5000, 9999, 100, 0, 'active', 'ed9aeaea94e822cdb47128ede15914d4.jpg', NULL, '2021-08-12 13:49:54', 'true'),
	(7, 'M107', 2, 'salafex X iremixbeer', 1000, 1200, 100, 0, 'active', '218f6c0dfadead7133fd6112b122fbd5.jpg', NULL, '2021-08-12 20:41:27', 'false'),
	(8, 'M108', 2, 'salafex X gaia toy comic tee limited edition', 1000, 2490, 100, 0, 'active', 'a5e4d96654293c175d4b4d56bc528056.jpg', NULL, '2021-08-12 20:46:08', 'false'),
	(9, 'M109', 2, 'salafex the moon tee limited edition', 1000, 1990, 100, 0, 'active', '0a72e7dd2a1bea142e4afced6747fb96.jpg', NULL, '2021-08-12 21:41:42', 'false'),
	(10, 'M110', 2, 'salafex all white logo tee', 1000, 1990, 100, 0, 'active', 'df6ab50596f34f672316c0bb0477cab7.jpg', NULL, '2021-08-12 21:45:25', 'true');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;

-- Dumping structure for table salafex.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(60) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(60) COLLATE utf8mb4_general_ci NOT NULL,
  `fname` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lname` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phone` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `addr` text COLLATE utf8mb4_general_ci,
  `status` enum('activate','unactivate','ban') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'activate',
  `create_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login` datetime DEFAULT NULL,
  `amounts` decimal(20,6) DEFAULT NULL,
  `role` enum('member','admin') COLLATE utf8mb4_general_ci DEFAULT 'member',
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `password` (`password`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table salafex.users: ~4 rows (approximately)
DELETE FROM `users`;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `uuid`, `email`, `password`, `fname`, `lname`, `phone`, `addr`, `status`, `create_at`, `last_login`, `amounts`, `role`) VALUES
	(1, '891d9d1d-01b6-40cd-b492-1000c0becbd3', 'a@a.com', '$2a$10$UnTPi7sNsbMfjxbe5fg8oudAwaR54x1JDaGpOdLhnNIoniJcxeRpi', 'Thoranin222', 'Devv', '0123456789', '111111', 'activate', '2021-08-13 10:43:36', '2021-09-13 19:41:48', NULL, 'member'),
	(2, 'f540a78a-b503-45fd-a9ea-d47312245c2f', 'b@b.com', '$2a$10$HAzABZ6LlR1t145ByO7/Yehj5UQyUYVREgB4h.tSoMRyJE9zxNg4q', 'b', 'b', 'b', 'b', 'activate', '2021-09-04 18:40:51', '2021-09-04 18:41:00', NULL, 'member'),
	(3, '49f8f983-9fd2-4fd3-8cbf-b2c1edcc0299', 'b@a.com', '$2a$10$uDVaav54niVhi6893uU9iejI4vmSPFNfIlP83bF7AcCItX9sbFgMS', 'b', 'dev', '0123456789', 'kahoot', 'activate', '2021-09-05 12:30:02', '2021-09-08 18:57:32', NULL, 'member'),
	(4, '0c53b751-db72-4947-8cb7-2f4147674787', 'earn@gmail.com', '$2a$10$MKkAAEmjxQY5YFEvHxtLTe0fL3/iL1WFsU8WXdCuPmsSoxOFnhSBq', 'earn', 'saichon', '0631148612', 'ff', 'activate', '2021-09-11 15:37:28', '2021-09-11 15:37:45', NULL, 'member');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
