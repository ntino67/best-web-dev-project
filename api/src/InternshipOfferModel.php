<?php

class InternshipOfferModel extends Model {
  public function __construct()
  {
    parent::__construct();

    $this->insert_params = ["id_company", "available_slots", "internship_offer_title", "internship_offer_description", "internship_offer_created_at", "internship_offer_expires_at", "id_business_sector", "base_salary", "internship_duration", "id_city"];

    $allowed_orderby = [
      "id_internship_offer" => "id_internship_offer",
      "internship_offer_title" => "internship_offer_title",
      "internship_offer_description" => "internship_offer_description",
      "business_sector_name" => "Bs.business_sector_name",
      "available_slots" => "available_slots",
      "internship_duration" => "internship_duration",
      "internship_offer_created_at" => "internship_offer_created_at",
      "internship_offer_expires_at" => "internship_offer_expires_at",
      "base_salary" => "base_salary",
      "id_company" => "C.id_company",
      "company_name" => "C.company_name",
      "id_city" => "Internship_offers.id_city",
      "city_name" => "C2.name",
      "id_business_sector" => "Internship_offers.id_business_sector",
      "business_sector_name" => "Bs.business_sector_name"
    ];

    $orderBy = Sorting::getFromQueryString($allowed_orderby);

    $allowed_filters = [
      "id_internship_offer" => ["type" => Filter::NUMBER, "replace" => "id_internship_offer"],
      "internship_offer_title" => ["type" => Filter::STRING, "replace" => "internship_offer_title"],
      "internship_offer_description" => ["type" => Filter::STRING, "replace" => "internship_offer_description"],
      "id_business_sector" => ["type" => Filter::NUMBER, "replace" => "Internship_offers.id_business_sector"],
      "business_sector_name" => ["type" => Filter::STRING, "replace" => "Bs.business_sector_name"],
      "available_slots" => ["type" => Filter::NUMBER, "replace" => "available_slots"],
      "internship_duration" => ["type" => Filter::NUMBER, "replace" => "internship_duration"],
      "base_salary" => ["type" => Filter::NUMBER, "replace" => "base_salary"],
      "id_company" => ["type" => Filter::NUMBER, "replace" => "C.id_company"],
      "company_name" => ["type" => Filter::STRING, "replace" => "C.company_name"],
      "id_city" => ["type" => Filter::NUMBER, "replace" => "Internship_offers.id_city"],
      "city_name" => ["type" => Filter::STRING, "replace" => "C2.name"],
      "id_business_sector" => ["type" => Filter::NUMBER, "replace" => "Internship_offers.id_business_sector"],
      "business_sector_name" => ["type" => Filter::STRING, "replace" => "Bs.business_sector_name"]
    ];

    $filter = Filter::getFromQueryString($allowed_filters);

    $this->use_paging = true;
    $this->use_parent_id = false;

    $this->sql_getAll = "
    SELECT id_internship_offer,
          internship_offer_title,
          internship_offer_description,
          Internship_offers.id_business_sector,
          Bs.business_sector_name,
          available_slots,
          internship_duration,
          internship_offer_created_at,
          internship_offer_expires_at,
          base_salary,
          C.id_company,
          C.company_name,
          Internship_offers.id_city,
          C2.name AS city_name,
          COUNT(*) OVER() AS total_count
    FROM Internship_offers
            JOIN web_project.Companies C on Internship_offers.id_company = C.id_company
            JOIN web_project.Business_sectors Bs on Bs.id_business_sector = Internship_offers.id_business_sector
            JOIN web_project.Cities C2 on Internship_offers.id_city = C2.id_city
    WHERE $filter internship_offer_active = 1
    ORDER BY $orderBy
    ";

    $this->sql_get = "
    SELECT id_internship_offer,
          internship_offer_title,
          internship_offer_description,
          Internship_offers.id_business_sector,
          Bs.business_sector_name,
          available_slots,
          internship_duration,
          internship_offer_created_at,
          internship_offer_expires_at,
          base_salary,
          C.id_company,
          C.company_name,
          Internship_offers.id_city,
          C2.name AS city_name,
          COUNT(*) OVER() AS total_count
    FROM Internship_offers
            JOIN web_project.Companies C on Internship_offers.id_company = C.id_company
            JOIN web_project.Business_sectors Bs on Bs.id_business_sector = Internship_offers.id_business_sector
            JOIN web_project.Cities C2 on Internship_offers.id_city = C2.id_city
    WHERE internship_offer_active = 1
    AND id_internship_offer = :id_object
    ";
    
    $this->sql_create = "
    INSERT INTO Internship_offers (id_company,
                                  available_slots,
                                  internship_offer_title,
                                  internship_offer_description,
                                  internship_offer_created_at,
                                  internship_offer_expires_at,
                                  id_business_sector,
                                  base_salary,
                                  internship_duration,
                                  id_city,
                                  internship_offer_active)
    VALUES (:id_company,
            :available_slots,
            :internship_offer_title,
            :internship_offer_description,
            :internship_offer_created_at,
            :internship_offer_expires_at,
            :id_business_sector,
            :base_salary,
            :internship_duration,
            :id_city,
            1)
    ";

    $this->sql_delete = "
    UPDATE Internship_offers
        SET internship_offer_active = 0
        WHERE id_internship_offer = :id_object
    ";
  }
}
