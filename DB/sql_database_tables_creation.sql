USE web_project;
CREATE TABLE `Roles` (
  `id_role` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255)
);

CREATE TABLE `Classes` (
  `id_class` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `class_year` VARCHAR(255)
);

CREATE TABLE `Centers` (
  `id_center` INT PRIMARY KEY AUTO_INCREMENT,
  `center_name` VARCHAR(255)
);

CREATE TABLE `Countries` (
  `id_country` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255)
);

CREATE TABLE `Business_sectors`(
   `id_business_sector` INT PRIMARY KEY AUTO_INCREMENT,
   `business_sector_name` VARCHAR(255)
);

CREATE TABLE `Cities` (
  `id_city` INT PRIMARY KEY AUTO_INCREMENT,
  `id_country` INT,
  `name` VARCHAR(255),
  `postal_code` VARCHAR(255)
);

CREATE TABLE `Companies` (
  `id_company` INT PRIMARY KEY AUTO_INCREMENT,
  `id_business_sector` INT,
  `company_name` VARCHAR(255),
  `company_description` VARCHAR(1000),
  `company_active` BOOL
);

CREATE TABLE `Internship_offers` (
  `id_internship_offer` INT PRIMARY KEY AUTO_INCREMENT,
  `id_company` INT,
  `id_business_sector` INT,
  `id_city` INT,
  `available_slots` INT,
  `internship_offer_title` VARCHAR(255),
  `internship_offer_description` VARCHAR(255),
  `internship_offer_created_at` DATE,
  `internship_offer_expires_at` DATE,
  `internship_duration` INT,
  `base_salary` INT,
  `internship_offer_active` BOOL
);

CREATE TABLE `Skills` (
  `id_skill` INT PRIMARY KEY AUTO_INCREMENT,
  `skill_name` VARCHAR(255)
);

CREATE TABLE `Users` (
  `id_user` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `first_name` VARCHAR(255),
  `last_name` VARCHAR(255),
  `email` VARCHAR(255),
  `password` BINARY(128),
  `salt` BINARY(16),
  `user_created_at` TIMESTAMP,
  `id_center` INTEGER,
  `id_role` INTEGER,
  `user_active` BOOL
);

CREATE TABLE `Applications` (
  `id_user` INT,
  `id_internship_offer` INT,
  `CV` VARCHAR(255),
  `motivation_letter` VARCHAR(255)
);

CREATE TABLE `Works_for` (
  `id_user` INT,
  `id_company` INT,
  `start_date` DATE,
  `end_date` DATE
);

CREATE TABLE `Company_Reviews` (
  `id_company` INT,
  `id_user` INT,
  `review_text` VARCHAR(255),
  `review_score` INT
);

CREATE TABLE `Required_Skills`(
   `id_internship_offer` INT,
   `id_skill` INT,
   PRIMARY KEY(`id_internship_offer`, `id_skill`),
   FOREIGN KEY(`id_internship_offer`) REFERENCES `Internship_offers`(`id_internship_offer`),
   FOREIGN KEY(`id_skill`) REFERENCES `Skills`(`id_skill`)
);


CREATE TABLE `Related_to_class` (
  `id_user` INTEGER,
  `id_class` INTEGER,
  PRIMARY KEY (`id_user`, `id_class`),
  FOREIGN KEY (`id_user`) REFERENCES `Users` (`id_user`),
  FOREIGN KEY (`id_class`) REFERENCES `Classes` (`id_class`)
);

CREATE TABLE `Situated` (
	`id_city` INTEGER,
    `id_company` INTEGER,
    PRIMARY KEY(`id_city`, `id_company`),
    FOREIGN KEY(`id_city`) REFERENCES `Cities`(`id_city`),
    FOREIGN KEY(`id_company`) REFERENCES `Companies`(`id_company`)
);

CREATE TABLE `Wish_list`(
   `id_internship_offer` INT,
   `id_user` INT,
   PRIMARY KEY(`id_internship_offer`, `id_user`),
   FOREIGN KEY(`id_internship_offer`) REFERENCES `Internship_offers`(`id_internship_offer`),
   FOREIGN KEY(`id_user`) REFERENCES `Users`(`id_user`)
);

CREATE TABLE `Addressed_to`(
   `id_class` INT,
   `id_internship_offer` INT,
   PRIMARY KEY(`id_class`, `id_internship_offer`),
   FOREIGN KEY(`id_class`) REFERENCES `Classes`(`id_class`),
   FOREIGN KEY(`id_internship_offer`) REFERENCES `Internship_offers`(`id_internship_offer`)
);



ALTER TABLE `Users` ADD CONSTRAINT `user_has_role` FOREIGN KEY (`id_role`) REFERENCES `Roles` (`id_role`);

ALTER TABLE `Users` ADD CONSTRAINT `user_is_in_center` FOREIGN KEY (`id_center`) REFERENCES `Centers` (`id_center`);

ALTER TABLE `Cities` ADD CONSTRAINT `city_is_in_country` FOREIGN KEY (`id_country`) REFERENCES `Countries` (`id_country`);

ALTER TABLE `Internship_offers` ADD CONSTRAINT `offer_belongs_to_company` FOREIGN KEY (`id_company`) REFERENCES `Companies` (`id_company`);

ALTER TABLE `Applications` ADD CONSTRAINT `fk_applications_internship_offers` FOREIGN KEY (`id_internship_offer`) REFERENCES `Internship_offers` (`id_internship_offer`);

ALTER TABLE `Applications` ADD CONSTRAINT `user_forever` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id_user`);

ALTER TABLE `Works_for` ADD CONSTRAINT `fk_works_for_companies` FOREIGN KEY (`id_company`) REFERENCES `Companies` (`id_company`);

ALTER TABLE `Works_for` ADD CONSTRAINT `fk_works_in_companies` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id_user`);

ALTER TABLE `Company_Reviews` ADD CONSTRAINT `fk_company_reviews_companies` FOREIGN KEY (`id_company`) REFERENCES `Companies` (`id_company`);

ALTER TABLE `Company_Reviews` ADD CONSTRAINT `fk_company_reviews_users` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id_user`);

ALTER TABLE `Company_Reviews` ADD CONSTRAINT Company_Reviews_pk PRIMARY KEY (id_user, id_company);

ALTER TABLE `Wish_list` ADD CONSTRAINT `user_is_here` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id_user`);

ALTER TABLE `Wish_list` ADD CONSTRAINT `internship_offer_exist` FOREIGN KEY (`id_internship_offer`) REFERENCES `Internship_offers` (`id_internship_offer`);

ALTER TABLE `Situated` ADD CONSTRAINT `city_exist` FOREIGN KEY (`id_city`) REFERENCES `Cities` (`id_city`);

ALTER TABLE `Situated` ADD CONSTRAINT `company_exist` FOREIGN KEY (`id_company`) REFERENCES `Companies` (`id_company`);

ALTER TABLE `Related_to_class` ADD CONSTRAINT `user_exist` FOREIGN KEY (`id_user`) REFERENCES `Users` (`id_user`);

ALTER TABLE `Related_to_class` ADD CONSTRAINT `class_exist` FOREIGN KEY (`id_class`) REFERENCES `Classes` (`id_class`);

ALTER TABLE `Required_Skills` ADD CONSTRAINT `internship_offer_exist2` FOREIGN KEY (`id_internship_offer`) REFERENCES `Internship_offers` (`id_internship_offer`);

ALTER TABLE `Required_Skills` ADD CONSTRAINT `skill_exist` FOREIGN KEY (`id_skill`) REFERENCES `Skills` (`id_skill`);

ALTER TABLE `Addressed_to` ADD CONSTRAINT `classinter_exist` FOREIGN KEY (`id_class`) REFERENCES `Classes` (`id_class`);

ALTER TABLE `Addressed_to` ADD CONSTRAINT `internship_offer_exist3` FOREIGN KEY (`id_internship_offer`) REFERENCES `Internship_offers` (`id_internship_offer`);

ALTER TABLE `Internship_offers` ADD CONSTRAINT `business_sector_exist1` FOREIGN KEY (`id_business_sector`) REFERENCES `Business_sectors` (`id_business_sector`);

ALTER TABLE `Companies` ADD CONSTRAINT `business_sector_exist2` FOREIGN KEY (`id_business_sector`) REFERENCES `Business_sectors` (`id_business_sector`);
