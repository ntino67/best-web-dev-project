<?php

class BusinessSectorModel extends Model
{
  public function __construct()
  {
    parent::__construct();

    $this->insert_params = [""];

    $this->use_paging = false;

    $this->use_parent_id = false;

    $this->sql_getAll = "
    SELECT *
    FROM Business_sectors
    ";

    $this->sql_get = "
    SELECT *
    FROM Business_sectors
    WHERE id_business_sector = :id_object
    ";
  }
}
