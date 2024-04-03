<?php

class CompanyModel extends Model 
{
  public function __construct()
  { 
    parent::__construct();

    $this->insert_params = ["id_business_sector", "company_name", "company_description"];

    $this->use_paging = true;

    $this->use_parent_id = false;

    $this->sql_getAll = "
    SELECT id_company, company_name, company_description, company_active, Companies.id_business_sector, business_sector_name, COUNT(*) OVER() AS total_count
    FROM Companies
    JOIN web_project.Business_sectors Bs on Bs.id_business_sector = Companies.id_business_sector
    WHERE company_active = 1
    ORDER BY Companies.id_company
    ";
    

    $this->sql_get = "
    SELECT id_company, company_name, company_description, company_active, Companies.id_business_sector, business_sector_name
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
