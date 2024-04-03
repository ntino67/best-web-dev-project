<?php

Class CityModel extends Model
{
  public function __construct()
  {
    parent::__construct();

    $this->insert_params = [""];
    
    $this->use_paging = false;

    $this->use_parent_id = false;

    $this->sql_getAll = "
    SELECT Cities.id_city, Cities.name AS city_name, C.id_country, C.name AS country_name, COUNT(*) OVER() AS total_count
    FROM web_project.Cities
            JOIN web_project.Countries C on C.id_country = Cities.id_country
    ";
    
    $this->sql_get = "
    SELECT Cities.id_city, Cities.name AS city_name, C.id_country, C.name AS country_name
    FROM web_project.Cities
            JOIN web_project.Countries C on C.id_country = Cities.id_country
    WHERE id_city = :id_object
    ";

  }
}
