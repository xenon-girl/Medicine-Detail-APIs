CREATE DATABASE saveo;
USE saveo;
DROP TABLE IF EXISTS `product_details`;

CREATE TABLE `product_details` (
  product_id int(11) NOT NULL AUTO_INCREMENT,
  c_name VARCHAR(150),
  c_batch_no VARCHAR(16),
  d_expiry_date DATE,
  n_balance_qty INT(8),
  c_packaging VARCHAR(16),
  c_unique_code INT(16),
  c_schemes VARCHAR(8),
  n_mrp DECIMAL(12, 2),
  c_manufacturer VARCHAR(255),
  hsn_code INT(16),
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `creation_date` datetime DEFAULT NULL,
  `last_update` datetime DEFAULT NULL,
  `last_updated_by` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

delimiter //
CREATE TRIGGER product_details_insert_trigger BEFORE INSERT ON product_details
FOR EACH ROW BEGIN
    SET NEW.creation_date=NOW();
    SET NEW.last_updated_by=USER();
    SET NEW.last_update=NOW();
END;//
CREATE TRIGGER product_details_update_trigger BEFORE UPDATE ON product_details
FOR EACH ROW
BEGIN
    SET NEW.last_updated_by=USER();
    SET NEW.last_update = NOW();
END;//
delimiter ;

DROP TABLE IF EXISTS `order_details`;

CREATE TABLE `order_details` (
  order_id int(11) NOT NULL AUTO_INCREMENT,
  unique_order_id VARCHAR(150),
  c_name VARCHAR(150),
  n_qty INT(8),
  c_unique_id INT(16),
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `creation_date` datetime DEFAULT NULL,
  `last_update` datetime DEFAULT NULL,
  `last_updated_by` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

delimiter //
CREATE TRIGGER order_details_insert_trigger BEFORE INSERT ON order_details
FOR EACH ROW BEGIN
    SET NEW.creation_date=NOW();
    SET NEW.last_updated_by=USER();
    SET NEW.last_update=NOW();
END;//
CREATE TRIGGER order_details_update_trigger BEFORE UPDATE ON order_details
FOR EACH ROW
BEGIN
    SET NEW.last_updated_by=USER();
    SET NEW.last_update = NOW();
END;//
delimiter ;