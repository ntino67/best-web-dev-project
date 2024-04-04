-- Procedure to add a user with password hashing and salt (pilote/student)
DELIMITER //
CREATE PROCEDURE uspAddUser (
    IN pLogin VARCHAR(50), 
    IN pPassword VARCHAR(50),
    IN pFirstName VARCHAR(40), 
    IN pLastName VARCHAR(40),
    IN pCenter integer,
    IN pRole integer,
    IN pActive bool,
    OUT responseMessage bool
)
BEGIN
    DECLARE salt BINARY(16);
    SET salt = UNHEX(REPLACE(UUID(), '-', ''));

    BEGIN
        INSERT INTO Users (first_name, last_name, email, password, salt, user_created_at, id_center, id_role, user_active)
        VALUES (pFirstName, pLastName, pLogin, SHA2(CONCAT(pPassword, HEX(salt)), 512), salt, NOW(), pCenter, pRole, pActive);

        SET responseMessage = 1;

    END;
END //
DELIMITER ;


-- Procedure to authenticate a user

DELIMITER //
CREATE PROCEDURE uspLogin(
    IN pLoginName varchar(254),
    IN pPassword varchar(50),
    OUT o_responseMessage tinyint(1),
    OUT o_id_user int)
BEGIN
    DECLARE userEmail VARCHAR(254);
    DECLARE inputHashedPassword BINARY(128); -- Correspond à la longueur du hachage SHA2 512
    DECLARE userSalt BINARY(16);
    DECLARE hashedPassword BINARY(128);

    SELECT email, password, salt, id_user
    INTO userEmail, hashedPassword, userSalt, o_id_user
    FROM Users
    WHERE email = pLoginName
    LIMIT 1;

    SET inputHashedPassword = SHA2(CONCAT(pPassword, HEX(userSalt)), 512);

    IF inputHashedPassword = hashedPassword THEN
        SET o_responseMessage = TRUE;
    ELSE
        SET o_responseMessage = FALSE;
    END IF;
END //

DELIMITER ;


-- Procedure to get company's data
DELIMITER //
CREATE PROCEDURE uspGetCompanyData (
    IN p_company_name VARCHAR(255),
    IN p_business_sector_name VARCHAR(255),
    IN p_locality VARCHAR(255),
    IN p_average_rating INTEGER,
    IN p_orderbyAZ BOOLEAN,
    IN p_orderbyZA BOOLEAN,
    IN p_orderby51 BOOLEAN,
    IN p_orderby15 BOOLEAN,
    IN p_orderbymax BOOLEAN,
    IN p_orderbymin BOOLEAN
)
BEGIN
    IF p_orderbymin IS NULL THEN
        SET p_orderbymin = FALSE;
    END IF;
    SELECT
        Companies.company_name AS 'Nom de l_entreprise',
        Business_sectors.business_sector_name AS 'Secteur d_activité',
        Cities.name AS 'Nom de la ville',
    COUNT(DISTINCT Applications.id_user) AS 'Nombre de stagiaires ayant postulé à une offre de cette entreprise',
    IFNULL(
        CAST(
            AVG(
                CASE 
                    WHEN Company_Reviews.review_score IS NOT NULL THEN Company_Reviews.review_score
                    ELSE NULL
                END
            ) AS FLOAT	
        ),
        'Non noté'
    ) AS 'Moyenne des évaluations des stagiaires/des Pilotes de promotion'
    FROM
        Companies
        INNER JOIN Situated ON Companies.id_company = Situated.id_company
        INNER JOIN Cities ON Situated.id_city = Cities.id_city
        LEFT JOIN Applications ON Companies.id_company = Applications.id_user
        LEFT JOIN Company_Reviews ON Companies.id_company = Company_Reviews.id_company
        INNER JOIN Business_sectors ON Companies.id_business_sector = Business_sectors.id_business_sector
    WHERE
        Companies.company_name LIKE CONCAT('%', p_company_name, '%')
        AND Business_sectors.business_sector_name LIKE CONCAT('%', p_business_sector_name, '%')
        AND Cities.name LIKE CONCAT('%', p_locality, '%')
        AND Companies.company_active = TRUE
    GROUP BY
        Companies.company_name,
        Business_sectors.business_sector_name,
        Cities.name
    HAVING
        IFNULL(AVG(
            CASE 
                WHEN Company_Reviews.review_score IS NOT NULL THEN Company_Reviews.review_score
                ELSE NULL
            END), 0) >= p_average_rating
    ORDER BY
        IF(p_orderbyAZ = TRUE, Companies.company_name, NULL) ASC,
        IF(p_orderbyZA = TRUE, Companies.company_name, NULL) DESC,
        IF(p_orderby51 = TRUE, IFNULL(AVG(
            CASE 
                WHEN Company_Reviews.review_score IS NOT NULL THEN Company_Reviews.review_score
                ELSE NULL
            END), 0), NULL) DESC,
        IF(p_orderby15 = TRUE, IFNULL(AVG(
            CASE 
                WHEN Company_Reviews.review_score IS NOT NULL THEN Company_Reviews.review_score
                ELSE NULL
            END), 0), NULL) ASC,
        IF(p_orderbymax = TRUE, COUNT(DISTINCT Applications.id_user), NULL) DESC,
        IF(p_orderbymin = TRUE, COUNT(DISTINCT Applications.id_user), NULL) ASC;
END //
DELIMITER ;


-- Procedure to create a company
DELIMITER //

CREATE PROCEDURE uspInsertCompany(
    IN p_id_business_sector INT,
    IN p_company_name VARCHAR(255),
    IN p_company_description VARCHAR(255),
    IN p_company_active BOOLEAN
)
BEGIN
    DECLARE company_id INT;

    -- Insérer l'entreprise
    INSERT INTO Companies (id_business_sector, company_name, company_description, company_active)
    VALUES (p_id_business_sector, p_company_name, p_company_description, p_company_active);
END //
DELIMITER ;
DELIMITER //


-- Procedure to associate city to a company
CREATE PROCEDURE uspInsertCompanyCities(
    IN p_company_id INT,
    IN p_city_ids VARCHAR(255) -- Liste d'IDs de ville séparés par des virgules
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE city_id INT;
    DECLARE cur CURSOR FOR SELECT id_city FROM Cities WHERE FIND_IN_SET(id_city, p_city_ids);
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO city_id;
        IF done THEN
            LEAVE read_loop;
        END IF;
        INSERT INTO Situated (id_city, id_company) VALUES (city_id, p_company_id);
    END LOOP;
    CLOSE cur;
END //

DELIMITER ;

-- Procedure to update a company
DELIMITER //


-- Procedure to update a company (city(ies) also)
DELIMITER //

CREATE PROCEDURE uspUpdateCompany(
    IN p_company_id INT,
    IN p_new_company_name VARCHAR(255),
    IN p_new_company_description VARCHAR(255),
    IN p_new_company_active BOOLEAN,
    IN p_new_business_sector INT,
    IN p_city_ids_to_add VARCHAR(255),
    IN p_city_ids_to_remove VARCHAR(255)
)
BEGIN
    DECLARE i INT;
    DECLARE j INT;
    DECLARE city_id INT;
    DECLARE city_id_to_add INT;
    
    -- Mise à jour des informations de l'entreprise
    UPDATE Companies 
    SET 
        company_name = p_new_company_name,
        company_description = p_new_company_description,
        company_active = p_new_company_active,
        id_business_sector = p_new_business_sector
    WHERE 
        id_company = p_company_id;

    -- Suppression des villes associées
    IF p_city_ids_to_remove IS NOT NULL THEN
        SET i = 1;
        
        WHILE i <= LENGTH(p_city_ids_to_remove) DO
            SET city_id = SUBSTRING_INDEX(SUBSTRING_INDEX(p_city_ids_to_remove, ',', i), ',', -1);
            DELETE FROM Situated WHERE id_company = p_company_id AND id_city = city_id;
            SET i = i + 1;
        END WHILE;
    END IF;

    -- Ajout des nouvelles villes associées
    IF p_city_ids_to_add IS NOT NULL THEN
        SET j = 1;
        
        WHILE j <= LENGTH(p_city_ids_to_add) DO
            SET city_id_to_add = SUBSTRING_INDEX(SUBSTRING_INDEX(p_city_ids_to_add, ',', j), ',', -1);
            
            -- Vérifier si la ville n'est pas déjà associée à l'entreprise
            IF NOT EXISTS (SELECT * FROM Situated WHERE id_company = p_company_id AND id_city = city_id_to_add) THEN
                INSERT INTO Situated (id_city, id_company) VALUES (city_id_to_add, p_company_id);
            END IF;
            
            SET j = j + 1;
        END WHILE;
    END IF;
END //

DELIMITER ;

-- Procedure to assess a company
DELIMITER //

CREATE PROCEDURE uspEvaluateCompany(
    IN p_company_id INT,
    IN p_user_id INT,
    IN p_review_text TEXT,
    IN p_review_score INT
)
BEGIN
    INSERT INTO Company_Reviews (id_company, id_user, review_text, review_score)
    SELECT 
        p_company_id, p_user_id, p_review_text, p_review_score
    FROM 
        Companies
    WHERE 
        id_company = p_company_id
        AND company_active = TRUE;
END //

DELIMITER ;


-- Procedure to add an offer to the wishlist
DELIMITER //

CREATE PROCEDURE uspAddOfferToWishlist(
    IN p_id_internship_offer INT,
    IN p_id_user INT
)
BEGIN
    INSERT INTO Wish_list (id_internship_offer, id_user)
    VALUES (p_id_internship_offer, p_id_user);
END //

DELIMITER ;


-- Procedure to remove an offer from the wishlist
DELIMITER //

CREATE PROCEDURE uspRemoveOfferFromWishlist(
    IN p_id_internship_offer INT,
    IN p_id_user INT
)
BEGIN
    DELETE FROM Wish_list
    WHERE id_internship_offer = p_id_internship_offer AND id_user = p_id_user;
END //

DELIMITER ;


-- Procedure to add an application
DELIMITER //

CREATE PROCEDURE uspAddApplication(
    IN p_id_user INT,
    IN p_id_internship_offer INT,
    IN p_CV VARCHAR(255),
    IN p_motivation_letter VARCHAR(255)
)
BEGIN
    INSERT INTO Applications (id_user, id_internship_offer, CV, motivation_letter)
    VALUES (p_id_user, p_id_internship_offer, p_CV, p_motivation_letter);
END //

DELIMITER ;



-- Procedure to update an user(pilote/student)
DELIMITER //

CREATE PROCEDURE uspUpdateUser (
    IN pUserId INT,
    IN pLoginName VARCHAR(254),
    IN pPassword VARCHAR(50),
    IN pFirstName VARCHAR(40),
    IN pLastName VARCHAR(40),
    IN pCenter VARCHAR(40)
)
BEGIN
    DECLARE userEmail VARCHAR(254);
    DECLARE hashedPassword BINARY(64);
    DECLARE userSalt BINARY(16);
    DECLARE oldCenter INT;

    SELECT email, password, salt, id_center INTO userEmail, hashedPassword, userSalt, oldCenter
    FROM Users WHERE id_user = pUserId LIMIT 1;

    -- Si un nouveau mot de passe est fourni, hasher le mot de passe
    IF pPassword <> '' THEN
        SET hashedPassword = SHA2(CONCAT(pPassword, HEX(userSalt)), 512);
    END IF;

    -- Vérifier si pCenter est vide ou NULL, et le définir sur la valeur actuelle si c'est le cas
    -- Actuellement ne fonctionne pas, utliser coté php :
    -- Récupérer l'ancienne valeur du centre pour l'utilisateur;
	-- SET @oldCenter = (SELECT id_center FROM Users WHERE id_user = 1);
	-- Appeler la procédure en utilisant l'ancienne valeur du centre;
	-- CALL uspUpdateUser(1, '', '', '', '', @oldCenter);
    
    IF pCenter IS NULL OR pCenter = '' THEN
        SET pCenter = oldCenter;
    END IF;

    UPDATE Users
    SET 
        first_name = IF(pFirstName <> '', pFirstName, first_name),
        last_name = IF(pLastName <> '', pLastName, last_name),
        email = IF(pLoginName <> '', pLoginName, email),
        id_center = pCenter,
        password = IF(pPassword <> '', hashedPassword, password)
    WHERE id_user = pUserId;
END //

DELIMITER ;


-- Procedure to 'delete' an user(pilote/student)
DELIMITER //

CREATE PROCEDURE uspDeactivateUser(
    IN p_user_id INT
)
BEGIN
    UPDATE Users 
    SET user_active = FALSE
    WHERE id_user = p_user_id AND id_role = 3;-- (3=student and 2=pilote)
END //

DELIMITER ;



-- Procedure to get user's data
DELIMITER //

CREATE PROCEDURE uspGetUserData(
    IN p_first_name VARCHAR(255),
    IN p_last_name VARCHAR(255),
    IN p_id_role INT,
    IN p_center_name VARCHAR(255),
    IN p_orderbyFirstNameDesc BOOLEAN,
    IN p_orderbyFirstNameASC BOOLEAN,
    IN p_orderbyPromotionsDesc BOOLEAN,
    IN p_orderbyPromotionsASC BOOLEAN,
    IN p_orderbyRoleIdDesc BOOLEAN,
    IN p_orderbyRoleIdAsc BOOLEAN
)
BEGIN
    SELECT
        Users.first_name,
        Users.last_name,
        Centers.center_name,
        IFNULL(promotions_assignees, '') AS promotions_assignees,
        IFNULL(wish_list_count, 0) AS wish_list_count
    FROM
        Users
    JOIN
        Works_for ON Users.id_user = Works_for.id_user
    JOIN
        Companies ON Works_for.id_company = Companies.id_company
    JOIN
        Centers ON Users.id_center = Centers.id_center
    LEFT JOIN (
        SELECT
            Users.first_name,
            Users.last_name,
            GROUP_CONCAT(DISTINCT Classes.class_year ORDER BY Classes.class_year ASC) AS promotions_assignees
        FROM
            Users
        JOIN
            Related_to_class ON Related_to_class.id_user = Users.id_user
        JOIN
            Classes ON Related_to_class.id_class = Classes.id_class
        GROUP BY
            Users.first_name, Users.last_name
    ) AS T ON T.first_name = Users.first_name AND T.last_name = Users.last_name
    LEFT JOIN (
        SELECT
            id_user,
            COUNT(id_internship_offer) AS wish_list_count
        FROM
            Wish_list
        GROUP BY
            id_user
    ) AS WL ON WL.id_user = Users.id_user
    WHERE
        Users.first_name LIKE CONCAT('%', p_first_name, '%')
        AND Users.last_name LIKE CONCAT('%', p_last_name, '%')
        AND Users.id_role LIKE CONCAT('%', p_id_role, '%')
        AND Centers.center_name LIKE CONCAT('%', p_center_name, '%')
    GROUP BY
        Users.first_name, 
        Users.last_name, 
        Centers.center_name
    ORDER BY
        IF(p_orderbyFirstNameDesc = TRUE, Users.first_name, NULL) DESC,
        IF(p_orderbyFirstNameASC = TRUE, Users.first_name, NULL) ASC,
        IF(p_orderbyPromotionsDesc = TRUE, promotions_assignees, NULL) DESC,
        IF(p_orderbyPromotionsASC = TRUE, promotions_assignees, NULL) ASC,
        IF(p_orderbyRoleIdDesc = TRUE, Users.id_role, NULL) ASC,
        IF(p_orderbyRoleIdAsc = TRUE, Users.id_role, NULL) DESC;
END //

DELIMITER ;

-- Procedure to Stats Companies
DELIMITER //
-- Sector
CREATE PROCEDURE uspCompanyStat_Sectors()
BEGIN
    SELECT * FROM (
        SELECT 
            Business_sectors.business_sector_name,
            COUNT(Business_sectors.business_sector_name) AS Total
        FROM
            Companies
        JOIN Business_sectors ON Business_sectors.id_business_sector = Companies.id_business_sector
        WHERE
            Companies.company_active = TRUE
        GROUP BY Business_sectors.business_sector_name
        ORDER BY Total DESC
        LIMIT 10
    ) AS subquery 
    UNION 
    SELECT 'AUTRES', SUM(subquery.Total) AS total FROM (
        SELECT 
            business_sectors.business_sector_name AS 'Autres',
            COUNT(Business_sectors.business_sector_name) AS Total
        FROM
            Companies
        JOIN Business_sectors ON Business_sectors.id_business_sector = Companies.id_business_sector
        WHERE
            Companies.company_active = TRUE
        GROUP BY Business_sectors.business_sector_name
        ORDER BY Total
        LIMIT 10000 OFFSET 10
    ) AS subquery;
END //

DELIMITER ;
-- Cities 
DELIMITER //

CREATE PROCEDURE uspCompanyStat_Cities()
BEGIN
    SELECT
        Cities.name,
        COUNT(Cities.name) AS total
    FROM
        Cities
    JOIN Situated ON Cities.id_city = Situated.id_city
    JOIN Companies ON Situated.id_company = Companies.id_company
    JOIN Countries ON Cities.id_country = Countries.id_country
    WHERE Companies.company_active = TRUE
    GROUP BY Cities.name;
END //

DELIMITER ;

-- Country
DELIMITER //

CREATE PROCEDURE uspCompanyStat_Countries()
BEGIN
    SELECT
        Countries.name, COUNT(Countries.name) AS total
    FROM
        Cities
    JOIN Situated ON Cities.id_city = Situated.id_city
    JOIN Companies ON Situated.id_company = Companies.id_company
    JOIN Countries ON Cities.id_country = Countries.id_country
    WHERE Companies.company_active = TRUE
    GROUP BY Countries.name;
END //

DELIMITER ;

-- Cities / Country 
DELIMITER //

CREATE PROCEDURE uspCompanyStat_CitiesInCountry(IN country_name VARCHAR(255))
BEGIN
    SELECT 
        cities.name, 
        COUNT(cities.name) AS total
    FROM
        cities
    JOIN situated ON cities.id_city = situated.id_city
    JOIN Companies ON situated.id_company = Companies.id_company
    JOIN countries ON cities.id_country = countries.id_country
    WHERE
        IF(country_name = '', Companies.company_active = TRUE, Companies.company_active = TRUE AND countries.name = country_name)
    GROUP BY cities.name;
END //

DELIMITER ;

-- Procedure Search_InternshipOffer
DELIMITER //

CREATE PROCEDURE uspInternshipOffersSearch(
    IN skill_name VARCHAR(255),
    IN locality VARCHAR(255),
    IN company_name VARCHAR(255),
    IN promotion_type VARCHAR(255),
    IN internship_duration INT,
    IN base_salary INT,
    IN internship_offer_created_at DATE,
    IN available_slots INT,
    IN applications_count INT,
    IN business_sector_name VARCHAR(255),
    IN orderbyAZ BOOLEAN,
    IN orderbyZA BOOLEAN,
    IN orderby51 BOOLEAN,
    IN orderby15 BOOLEAN,
    IN orderbymax BOOLEAN,
    IN orderbymin BOOLEAN
)
BEGIN

SET internship_duration := IF(internship_duration <> '', NULL, internship_duration);
SET base_salary := IF(base_salary <> '', NULL, base_salary);
SET internship_offer_created_at := IF(internship_offer_created_at <> '', '2020-01-01', internship_offer_created_at);
SET available_slots := IF(available_slots <> '', NULL,available_slots);
SET applications_count := IF(applications_count <> '', NULL, applications_count);

    SELECT
        Internship_offers.internship_offer_title AS 'Titre de l_offre',
        IFNULL(
            (
                SELECT GROUP_CONCAT(Classes.class_year)
                FROM Addressed_to
                LEFT JOIN Classes ON Addressed_to.id_class = Classes.id_class
                WHERE Addressed_to.id_internship_offer = Internship_offers.id_internship_offer
                GROUP BY Addressed_to.id_internship_offer
            ),
            ''
        ) AS 'Types de promotions concernées',
        IFNULL(
            (
                SELECT GROUP_CONCAT(Skills.skill_name)
                FROM Required_Skills
                LEFT JOIN Skills ON Required_Skills.id_skill = Skills.id_skill
                WHERE Required_Skills.id_internship_offer = Internship_offers.id_internship_offer
                GROUP BY Required_Skills.id_internship_offer
            ),
            ''
        ) AS 'Compétences requises',
        Business_sectors.business_sector_name AS 'Secteur d_activité',
        Cities.name AS 'Localité',
        Companies.company_name AS 'Nom de l_entreprise',
        Internship_offers.internship_duration AS 'Durée du stage',
        Internship_offers.base_salary AS 'Base de rémunération',
        Internship_offers.internship_offer_created_at AS 'Date de l_offre',
        Internship_offers.available_slots AS 'Nombre de places offertes aux étudiants',
        COUNT(Applications.id_user) AS 'Nombre d_élèves ayant déjà postulé à cette offre'
    FROM
        Internship_offers
        LEFT JOIN Companies ON Internship_offers.id_company = Companies.id_company
        LEFT JOIN Business_sectors ON Internship_offers.id_business_sector = Business_sectors.id_business_sector
        LEFT JOIN Applications ON Internship_offers.id_internship_offer = Applications.id_internship_offer
        LEFT JOIN Situated ON Internship_offers.id_company = Situated.id_company
        LEFT JOIN Cities ON Situated.id_city = Cities.id_city
        LEFT JOIN Addressed_to ON Internship_offers.id_internship_offer = Addressed_to.id_internship_offer
        LEFT JOIN Classes ON Addressed_to.id_class = Classes.id_class
        LEFT JOIN Required_Skills ON Internship_offers.id_internship_offer = Required_Skills.id_internship_offer
        LEFT JOIN Skills ON Required_Skills.id_skill = Skills.id_skill
    WHERE
        (Cities.name LIKE CONCAT('%', locality, '%') OR locality = '')
        AND (Companies.company_name LIKE CONCAT('%', company_name, '%') OR company_name = '')
        AND (Classes.class_year LIKE CONCAT('%', promotion_type, '%') OR promotion_type = '')
        AND (Skills.skill_name LIKE CONCAT('%', skill_name, '%') OR skill_name = '')
        AND (Internship_offers.internship_duration LIKE CONCAT('%', internship_duration, '%') OR internship_duration = '')
        AND (Internship_offers.base_salary LIKE CONCAT('%', base_salary, '%') OR base_salary = '')
        AND (Internship_offers.internship_offer_created_at LIKE CONCAT('%', internship_offer_created_at, '%') OR internship_offer_created_at = '')
        AND (Internship_offers.available_slots LIKE CONCAT('%', available_slots, '%') OR available_slots = '')
        AND (Business_sectors.business_sector_name LIKE CONCAT('%', business_sector_name, '%') OR business_sector_name = '')
    GROUP BY
        Internship_offers.id_internship_offer,
        Cities.name,
        Companies.company_name,
        Internship_offers.internship_duration,
        Internship_offers.base_salary,
        Internship_offers.internship_offer_created_at,
        Internship_offers.available_slots
    HAVING
        COUNT(Applications.id_user) >= applications_count
    ORDER BY
        IF(orderbyAZ = TRUE, Internship_offers.internship_offer_title, NULL) ASC,
        IF(orderbyZA = TRUE, Internship_offers.internship_offer_title, NULL) DESC,
        IF(orderby51 = TRUE, Internship_offers.available_slots, NULL) DESC,
        IF(orderby15 = TRUE, Internship_offers.available_slots, NULL) ASC,
        IF(orderbymax = TRUE, COUNT(Applications.id_user), NULL) DESC,
        IF(orderbymin = TRUE, COUNT(Applications.id_user), NULL) ASC;
END //

DELIMITER ;

-- Procedure to Create InternshipOffer
DELIMITER //

CREATE PROCEDURE uspInternshipOffersCreate(
    IN id_company_val INT,
    IN available_slots_val INT,
    IN title_val VARCHAR(255),
    IN description_val VARCHAR(255),
    IN created_at_val DATE,
    IN expires_at_val DATE,
    IN id_business_sector_val INT,
    IN duration_val INT,
    IN base_salary_val INT,
    OUT id_internship_offer_val INT
)
BEGIN
    -- Insertion dans la table Internship_offers
    INSERT INTO Internship_offers (id_company, id_business_sector, available_slots, internship_offer_title, internship_offer_description, internship_offer_created_at, internship_offer_expires_at, internship_duration, base_salary, internship_offer_active)
    VALUES (id_company_val, id_business_sector_val, available_slots_val, title_val, description_val, created_at_val, expires_at_val, duration_val, base_salary_val, 1);

    -- Récupération de l'ID de l'offre de stage insérée
    SET id_internship_offer_val := LAST_INSERT_ID();

    -- Insertion dans la table Addressed_to
    INSERT INTO Addressed_to (id_class, id_internship_offer) 
    SELECT id_class, id_internship_offer_val FROM Classes  
    WHERE id_class IN (1, 2, 3, 4, 5);
END //

DELIMITER ;


-- Procedure to Delete InternshipOffer
DELIMITER //

CREATE PROCEDURE uspInternshipOffersDelete(
    IN offer_id_val INT
)
BEGIN
    UPDATE Internship_offers 
    SET internship_offer_active = FALSE
    WHERE id_internship_offer = offer_id_val;
END //

DELIMITER ;

-- Procedure to Stat IntershipOffer
-- Skills
DELIMITER //

CREATE PROCEDURE uspInternshipOffersStat_Skills()
BEGIN
    SELECT 
        skill_name AS 'Skill name', COUNT(skill_name) AS total
    FROM
        Required_Skills
    JOIN Internship_offers ON Required_Skills.id_internship_offer = Internship_offers.id_internship_offer
    JOIN Skills ON Required_Skills.id_skill = Skills.id_skill
    WHERE
        Internship_offers.internship_offer_active = TRUE
    GROUP BY skill_name;
END //

DELIMITER ;

-- City
DELIMITER //

CREATE PROCEDURE uspInternshipOffersStat_Cities()
BEGIN
    SELECT
        Cities.name AS 'City',
        COUNT(Cities.name) AS total
    FROM
        Cities
    JOIN Situated ON Cities.id_city = Situated.id_city
    JOIN Companies ON Situated.id_company = Companies.id_company
    JOIN Internship_offers ON Internship_offers.id_company = Companies.id_company
    JOIN Countries ON Cities.id_country = Countries.id_country
    WHERE
        Internship_offers.internship_offer_active = TRUE
        AND Companies.company_active = TRUE
    GROUP BY Cities.name;
END //

DELIMITER ;

-- Country 
DELIMITER //

CREATE PROCEDURE uspInternshipOffersStat_Countries()
BEGIN
    SELECT
        Countries.name AS 'Country', COUNT(Countries.name) AS total
    FROM
        Cities
    JOIN Situated ON Cities.id_city = Situated.id_city
    JOIN Companies ON Situated.id_company = Companies.id_company
    JOIN Countries ON Cities.id_country = Countries.id_country
    JOIN Internship_offers ON Internship_offers.id_company = Companies.id_company
    WHERE
        Internship_offers.internship_offer_active = TRUE
        AND Companies.company_active = TRUE
    GROUP BY Countries.name;
END //

DELIMITER ;

-- Promo
DELIMITER //

CREATE PROCEDURE uspInternshipOffersStat_Classes()
BEGIN
    SELECT
        Classes.class_year AS 'Class', COUNT(Classes.class_year) AS Total
    FROM
        Internship_offers
    JOIN Addressed_to ON Addressed_to.id_internship_offer = Internship_offers.id_internship_offer
    JOIN Classes ON Classes.id_class = Addressed_to.id_class
    WHERE
        Internship_offers.internship_offer_active = TRUE
    GROUP BY Classes.class_year;
END //

DELIMITER ;

-- durée
DELIMITER //

CREATE PROCEDURE uspInternshipOffersStat_Duration()
BEGIN
    SELECT 
        CONCAT(Internship_offers.internship_duration, ' mois') AS duration,
        COUNT(Internship_offers.internship_duration) AS Total
    FROM
        Internship_offers
        JOIN Companies ON Companies.id_company = Internship_offers.id_company
    WHERE
        Internship_offers.internship_offer_active = TRUE
        AND Companies.company_active = TRUE
    GROUP BY internship_duration
    ORDER BY internship_duration;
END //

DELIMITER ;

-- Procedure to Create Pilot
DELIMITER //

CREATE PROCEDURE uspCreatePilot(
    IN first_name_val VARCHAR(255),
    IN last_name_val VARCHAR(255),
    IN email_val VARCHAR(255),
    IN password_val VARCHAR(255),
    IN id_center_val INT
)
BEGIN
	DECLARE salt BINARY(16);
    SET salt = UNHEX(REPLACE(UUID(), '-', ''));
    
    BEGIN
		INSERT INTO Users (first_name, last_name, email, password, salt, user_created_at, id_center, id_role, user_active)
		VALUES (first_name_val, last_name_val, email_val, SHA2(CONCAT(password_val, HEX(salt)), 512), salt, NOW(), id_center_val, 2, 1);

		SET @id_user = LAST_INSERT_ID();

		INSERT INTO Related_to_class (id_user, id_class)
		SELECT @id_user, id_class FROM Classes 
		WHERE id_class IN (1, 2, 3, 4, 5);
	END;
END //

DELIMITER ;

-- Procedure to Update Pilot
DELIMITER //

CREATE PROCEDURE uspUpdatePilot(
    IN first_name_val VARCHAR(255),
    IN last_name_val VARCHAR(255),
    IN email_val VARCHAR(255),
    IN password_val VARCHAR(255),
    IN id_center_val INT,
    IN id_user_val INT
)
BEGIN
    UPDATE Users
    SET 
        first_name = IF(first_name_val <> '', first_name_val, first_name),
        last_name = IF(last_name_val <> '', last_name_val, last_name),
        email = IF(email_val <> '', email_val, email),
        password = IF(password_val <> '', password_val, password),
        id_center = IF(id_center_val <> '', id_center_val, id_center)
    WHERE id_user = id_user_val
        AND (first_name_val <> '' OR last_name_val <> '' OR email_val <> '' OR password_val <> '' OR id_center_val <> '');

    DELETE FROM Related_to_class 
    WHERE id_user = id_user_val
    AND (id_class1_val <> '' OR id_class2_val <> '' OR id_class3_val <> '' OR id_class4_val <> '' OR id_class5_val <> '');

    INSERT INTO Related_to_class (id_user, id_class)
    SELECT id_user_val, id_class FROM Classes 
    WHERE id_class IN ('', 2, '', 4, '');
END //

DELIMITER ;

-- Procedure to Delete Pilot
DELIMITER //

CREATE PROCEDURE uspDeletePilot(
    IN user_id_val INT
)
BEGIN
    UPDATE Users 
    SET user_active = FALSE
    WHERE id_user = user_id_val AND id_role = 2;
END //

DELIMITER ;

-- Procedure to Stat_Student
-- whish-list
DELIMITER //

CREATE PROCEDURE uspStudentStat_Wishlist(IN user_id INT)
BEGIN
    SELECT 
        COUNT(Users.id_user) AS 'total wish-list'
    FROM
        Wish_list
        JOIN Users ON Users.id_user = Wish_list.id_user
        JOIN Internship_offers ON Internship_offers.id_internship_offer = Wish_list.id_internship_offer
    WHERE 
        Users.user_active = TRUE 
        AND Internship_offers.internship_offer_active = TRUE 
        AND Users.id_user = user_id updateUser And RelatedClassesupdateUser And RelatedClasses -- TODO FIX THIS MESS
    GROUP BY Users.id_user;
END //

DELIMITER ;

-- Application
DELIMITER //

CREATE PROCEDURE uspStudentStat_Applications(IN user_id INT)
BEGIN
    SELECT 
        COUNT(Users.id_user) AS 'total application'
    FROM
        Applications
        JOIN Users ON Users.id_user = Applications.id_user
        JOIN Internship_offers ON Internship_offers.id_internship_offer = Applications.id_internship_offer
    WHERE 
        Users.user_active = TRUE 
        AND Internship_offers.internship_offer_active = TRUE 
        AND Users.id_user = user_id
    GROUP BY Users.id_user;
END //

DELIMITER ;

-- Fonction nombre de stages d'une entreprise

CREATE FUNCTION uspGetCompanyInternshipCount(company_id INTEGER)
    RETURNS INTEGER
BEGIN
    DECLARE num_internships INTEGER;

    SELECT COUNT(*) INTO num_internships
    FROM Internship_offers
    WHERE Internship_offers.id_company = company_id;

    RETURN num_internships;
END;