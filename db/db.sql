
DELIMITER $$

DROP PROCEDURE IF EXISTS `daily_sales_total`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `daily_sales_total` (IN `saleDate` DATE, OUT `totalSales` DECIMAL(10,2))   BEGIN
    SELECT SUM(total)
    INTO totalSales
    FROM sales
    WHERE DATE(date) = saleDate;
END$$

DELIMITER ;

DROP TABLE IF EXISTS `articles`;
CREATE TABLE IF NOT EXISTS `articles` (
  `idArticle` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`idArticle`)
) ;


INSERT INTO `articles` (`idArticle`, `name`, `price`, `stock`) VALUES
(1, 'Fron', 22.00, 43),
(2, 'Back', 10.00, 100);

DROP TABLE IF EXISTS `tables`;
CREATE TABLE IF NOT EXISTS `tables` (
  `idTable` int NOT NULL AUTO_INCREMENT,
  `number` int NOT NULL,
  `status` enum('occupied','available') DEFAULT 'available',
  PRIMARY KEY (`idTable`),
  UNIQUE KEY `number` (`number`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `tables` (`idTable`, `number`, `status`) VALUES
(1, 1, ''),
(2, 2, 'available'),
(3, 3, ''),
(4, 4, ''),
(5, 5, ''),
(6, 6, '');


DROP TABLE IF EXISTS `unifiedorders`;
CREATE TABLE IF NOT EXISTS `unifiedorders` (
  `idOrder` int NOT NULL AUTO_INCREMENT,
  `idTable` int NOT NULL,
  `date` datetime NOT NULL,
  `state` enum('sin_atender','en_espera','completado') DEFAULT 'sin_atender',
  `description` varchar(255) DEFAULT NULL,
  `idArticle` int NOT NULL,
  `quantity` int NOT NULL,
  `total` decimal(10,2) GENERATED ALWAYS AS ((`quantity` * `unitPrice`)) VIRTUAL,
  `comments` varchar(255) DEFAULT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idOrder`),
  KEY `idTable` (`idTable`),
  KEY `idArticle` (`idArticle`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS `unifiedsales`;
CREATE TABLE IF NOT EXISTS `unifiedsales` (
  `idSale` int NOT NULL AUTO_INCREMENT,
  `idTable` int NOT NULL,
  `idArticle` int NOT NULL,
  `nameArticle` varchar(100) NOT NULL,
  `quantity` int NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `totalArticle` decimal(10,2) GENERATED ALWAYS AS ((`quantity` * `unitPrice`)) VIRTUAL,
  `extraCharge` decimal(10,2) DEFAULT '0.00',
  `date` datetime NOT NULL,
  `payAmount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idSale`),
  KEY `idTable` (`idTable`),
  KEY `idArticle` (`idArticle`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `user` (`id`, `name`, `password`) VALUES
(3, 'Beca', '$2a$10$KU1jKfG1oz5rskPOgei8Ue7lR7kK8sqlj9znnLhun694ah4OdSntm');
COMMIT;
