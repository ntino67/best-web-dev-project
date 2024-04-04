<?php

class CompanyModel extends Model 
{
  public function __construct()
  { 
    parent::__construct();

    $this->insert_params = ["id_business_sector", "company_name", "company_description"];

    $allowed_orderby = [
      "id_company" => "Companies.id_company",
      "company_name" => "Companies.company_name",
      "company_description" => "Companies.company_description",
      "business_sector_name" => "Bs.business_sector_name",
      "internship_amt" => "uspGetCompanyInternshipCount(Companies.id_company)",
      "review_avg" => "uspGetCompanyAverageReviews(Companies.id_company)",
      "student_amt" => "uspGetCompanyStudentCount(Companies.id_company)"
    ];

    $orderBy = Sorting::getFromQueryString($allowed_orderby);

    $allowed_filters = [
      "id_company" => ["type" => Filter::NUMBER, "replace" => "Companies.id_company"],
      "company_name" => ["type" => Filter::STRING, "replace" => "Companies.company_name"],
      "company_description" => ["type" => Filter::STRING, "replace" => "Companies.company_description"],
      "id_business_sector" => ["type" => Filter::NUMBER, "replace" => "Companies.id_business_sector"],
      "business_sector_name" => ["type" => Filter::STRING, "replace" => "Bs.business_sector_name"],
      "internship_amt" => ["type" => Filter::NUMBER, "replace" => "uspGetCompanyInternshipCount(Companies.id_company)"],
      "review_avg" => ["type" => Filter::NUMBER, "replace" => "uspGetCompanyAverageReviews(Companies.id_company)"],
      "student_amt" => ["type" => Filter::NUMBER, "replace" => "uspGetCompanyStudentCount(Companies.id_company)"]
    ];

    $filter = Filter::getFromQueryString($allowed_filters);

    $this->use_paging = true;

    $this->use_parent_id = false;

    $this->sql_getAll = "
    SELECT id_company, 
           company_name, 
           company_description, 
           company_active, 
           Companies.id_business_sector, 
           business_sector_name, 
           COUNT(*) OVER() AS total_count, 
           uspGetCompanyInternshipCount(Companies.id_company) AS internship_amt, 
           uspGetCompanyAverageReviews(Companies.id_company) AS review_avg,
           uspGetCompanyStudentCount(Companies.id_company) AS student_amt
    FROM Companies
    JOIN web_project.Business_sectors Bs on Bs.id_business_sector = Companies.id_business_sector
    WHERE $filter company_active = 1
    ORDER BY $orderBy
    ";
    

    $this->sql_get = "
    SELECT id_company, 
           company_name, 
           company_description, 
           company_active, 
           Companies.id_business_sector, 
           business_sector_name, 
           uspGetCompanyInternshipCount(Companies.id_company) AS internship_amt, 
           uspGetCompanyStudentCount(Companies.id_company) AS student_amt
    FROM Companies
    JOIN web_project.Business_sectors Bs on Bs.id_business_sector = Companies.id_business_sector
    WHERE company_active = 1
      AND id_company = :id_object
    ";
    
    $this->sql_create = "
        INSERT INTO Companies (id_business_sector, company_name, company_description, company_active)
        VALUES (:id_business_sector, :company_name, :company_description, 1)
    ";

    $this->sql_update = "
    UPDATE Companies 
    SET 
        id_business_sector = :id_business_sector,
        company_name = :company_name,
        company_description = :company_description
    WHERE 
        id_company = :id_object
    ";



    $this->sql_delete = "
    UPDATE Companies
    SET company_active = 0
    WHERE id_company = :id_object
    ";
  }
}
