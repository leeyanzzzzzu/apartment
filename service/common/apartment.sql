-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- Server version:               5.7.30-log - MySQL Community Server (GPL)
-- Server OS:                    Win64
-- HeidiSQL 版本:                  10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for apartment
CREATE DATABASE IF NOT EXISTS `apartment` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `apartment`;

-- Dumping structure for table apartment.bs_collect
CREATE TABLE IF NOT EXISTS `bs_collect` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '收藏人uid',
  `homeid` int(11) NOT NULL COMMENT '房源id',
  PRIMARY KEY (`id`),
  KEY `FK_bs_collect_bs_user` (`uid`),
  KEY `FK_bs_collect_bs_homeresources` (`homeid`),
  CONSTRAINT `FK_bs_collect_bs_homeresources` FOREIGN KEY (`homeid`) REFERENCES `bs_homeresources` (`id`),
  CONSTRAINT `FK_bs_collect_bs_user` FOREIGN KEY (`uid`) REFERENCES `bs_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- Dumping data for table apartment.bs_collect: ~1 rows (approximately)
/*!40000 ALTER TABLE `bs_collect` DISABLE KEYS */;
/*!40000 ALTER TABLE `bs_collect` ENABLE KEYS */;

-- Dumping structure for table apartment.bs_comment
CREATE TABLE IF NOT EXISTS `bs_comment` (
  `cid` int(11) NOT NULL AUTO_INCREMENT,
  `homeid` int(11) NOT NULL COMMENT '房源id',
  `uid` int(11) NOT NULL COMMENT '评论人',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '评论内容',
  `create_at` datetime NOT NULL COMMENT '评论时间',
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- Dumping data for table apartment.bs_comment: ~2 rows (approximately)
/*!40000 ALTER TABLE `bs_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `bs_comment` ENABLE KEYS */;

-- Dumping structure for table apartment.bs_homeresources
CREATE TABLE IF NOT EXISTS `bs_homeresources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) DEFAULT NULL COMMENT '发布人',
  `housename` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '房名称',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '地址',
  `size` int(11) NOT NULL COMMENT '面积',
  `price` int(11) NOT NULL COMMENT '价格',
  `imgurl` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '图片地址',
  `status` int(11) NOT NULL COMMENT '状态0：待审核，1：审核通过待发布，2：审核不通过3：已发布，4：已下架',
  `create_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房源表';

-- Dumping data for table apartment.bs_homeresources: ~3 rows (approximately)
/*!40000 ALTER TABLE `bs_homeresources` DISABLE KEYS */;
INSERT INTO `bs_homeresources` (`id`, `uid`, `housename`, `address`, `size`, `price`, `imgurl`, `status`, `create_at`) VALUES
	(1, 1, '房源3333', 'R大街', 200, 10000, 'http://localhost:3000/images/upload_b179e9a162bc9e4ebc08f922eb5cc190.jpg', 0, '2020-05-12 18:00:00'),
	(2, 1, '精品公寓，拎包入住', '小胡口', 90, 6000, 'http://localhost:3000/avatar_uploads/head.jpg', 0, '2020-05-12 18:00:00'),
	(6, 1, '房源修改', '东大街', 120, 8000, 'http://localhost:3000/images/upload_12a062805e85798ac216cc5d046aabfc.jpg', 0, '2020-05-15 17:01:02'),
	(7, 1, '房源111', '南大街', 120, 8000, 'http://localhost:3000/images/upload_ce53df3edd1b9b398ffcd383b9914c6d.jpg', 0, '2020-05-15 17:30:50'),
	(8, 1, '房源222', '北大街', 90, 7000, 'http://localhost:3000/images/upload_9e58c743dbdd2233057c480e9510c2f9.jpg', 0, '2020-05-15 17:31:43'),
	(9, 33, '房东房源1', '地址11111', 90, 5000, 'http://localhost:3000/images/upload_d86f4005222dbd7359a271a10b2fa2be.jpg', 0, '2020-05-16 11:55:22');
/*!40000 ALTER TABLE `bs_homeresources` ENABLE KEYS */;

-- Dumping structure for table apartment.bs_menu
CREATE TABLE IF NOT EXISTS `bs_menu` (
  `menuid` int(11) NOT NULL AUTO_INCREMENT,
  `parentid` int(11) DEFAULT NULL COMMENT '父id',
  `menuname` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '菜单名',
  `menuurl` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '菜单路径',
  PRIMARY KEY (`menuid`),
  KEY `parent_id` (`parentid`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='菜单表';

-- Dumping data for table apartment.bs_menu: ~11 rows (approximately)
/*!40000 ALTER TABLE `bs_menu` DISABLE KEYS */;
INSERT INTO `bs_menu` (`menuid`, `parentid`, `menuname`, `menuurl`) VALUES
	(1, 0, '个人中心', '#'),
	(2, 1, '我的订单', 'MyOrder'),
	(3, 1, '个人信息', 'MyInfo'),
	(5, 1, '我的收藏', 'MyCollect'),
	(6, 0, '房源管理', 'HouseManage'),
	(7, 0, '订单管理', 'OrderManage'),
	(9, 0, '评论管理', 'Comment'),
	(10, 0, '服务中心', 'ServiceCentre'),
	(11, 0, '系统管理', '#'),
	(12, 11, '用户管理', 'UserManage'),
	(13, 11, '角色管理', 'RoleManage');
/*!40000 ALTER TABLE `bs_menu` ENABLE KEYS */;

-- Dumping structure for table apartment.bs_menu_role
CREATE TABLE IF NOT EXISTS `bs_menu_role` (
  `menu_id` int(11) NOT NULL COMMENT '菜单id',
  `role_id` int(11) NOT NULL COMMENT '角色id',
  PRIMARY KEY (`menu_id`,`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='权限表';

-- Dumping data for table apartment.bs_menu_role: ~24 rows (approximately)
/*!40000 ALTER TABLE `bs_menu_role` DISABLE KEYS */;
INSERT INTO `bs_menu_role` (`menu_id`, `role_id`) VALUES
	(1, 1),
	(1, 2),
	(1, 3),
	(2, 1),
	(2, 2),
	(2, 3),
	(3, 1),
	(3, 2),
	(3, 3),
	(4, 1),
	(4, 2),
	(5, 1),
	(5, 2),
	(5, 3),
	(6, 1),
	(6, 2),
	(7, 1),
	(7, 2),
	(8, 1),
	(9, 1),
	(10, 1),
	(10, 2),
	(10, 3),
	(11, 1),
	(12, 1),
	(13, 1);
/*!40000 ALTER TABLE `bs_menu_role` ENABLE KEYS */;

-- Dumping structure for table apartment.bs_order
CREATE TABLE IF NOT EXISTS `bs_order` (
  `oid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `orderNo` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号',
  `homeid` int(11) NOT NULL COMMENT '房源id',
  `status` int(11) NOT NULL DEFAULT '0' COMMENT '订单状态0：未支付1：已支付,2:已取消',
  `month` int(11) NOT NULL COMMENT '租用时长',
  `price` int(11) NOT NULL COMMENT '订单价格',
  `start` datetime DEFAULT NULL COMMENT '开始时间',
  `end` datetime DEFAULT NULL COMMENT '结束时间',
  `create_at` datetime NOT NULL COMMENT '下单时间',
  PRIMARY KEY (`oid`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- Dumping data for table apartment.bs_order: ~4 rows (approximately)
/*!40000 ALTER TABLE `bs_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `bs_order` ENABLE KEYS */;

-- Dumping structure for table apartment.bs_pay
CREATE TABLE IF NOT EXISTS `bs_pay` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `oid` int(11) NOT NULL COMMENT '订单id',
  `money` int(11) NOT NULL,
  `create_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='支付表';

-- Dumping data for table apartment.bs_pay: ~2 rows (approximately)
/*!40000 ALTER TABLE `bs_pay` DISABLE KEYS */;
/*!40000 ALTER TABLE `bs_pay` ENABLE KEYS */;

-- Dumping structure for table apartment.bs_role
CREATE TABLE IF NOT EXISTS `bs_role` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) DEFAULT NULL COMMENT '角色名',
  `description` varchar(100) DEFAULT NULL COMMENT '角色描述',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='角色表';

-- Dumping data for table apartment.bs_role: ~3 rows (approximately)
/*!40000 ALTER TABLE `bs_role` DISABLE KEYS */;
INSERT INTO `bs_role` (`role_id`, `role_name`, `description`) VALUES
	(1, '管理员', '最高管理员'),
	(2, '房东', '房东'),
	(3, '普通用户', '普通用户');
/*!40000 ALTER TABLE `bs_role` ENABLE KEYS */;

-- Dumping structure for table apartment.bs_user
CREATE TABLE IF NOT EXISTS `bs_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '昵称',
  `mobile` varchar(50) DEFAULT NULL COMMENT '手机号',
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) NOT NULL COMMENT '密码',
  `sex` varchar(50) DEFAULT NULL COMMENT '性别',
  `roleid` int(11) NOT NULL COMMENT '角色id',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像路径',
  `realname` varchar(255) DEFAULT NULL COMMENT '真实姓名',
  `id_card` varchar(255) DEFAULT NULL COMMENT '身份证号',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- Dumping data for table apartment.bs_user: ~1 rows (approximately)
/*!40000 ALTER TABLE `bs_user` DISABLE KEYS */;
INSERT INTO `bs_user` (`id`, `username`, `mobile`, `email`, `password`, `sex`, `roleid`, `avatar`, `realname`, `id_card`) VALUES
	(1, '管理员', '18071520960', '335074273@qq.com', '456', '男', 1, 'http://localhost:3000/avatar_uploads/head.jpg', 'jjj', '123456');
/*!40000 ALTER TABLE `bs_user` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
