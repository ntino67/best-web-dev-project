<?php

class CenterModel extends Model
{
  public function __construct()
  {
    parent::__construct();

    $this->insert_params = [""];

    $this->use_paging = false;

    $this->use_parent_id = false;

    $this->sql_getAll = "
    SELECT * FROM Centers
    ";

    $this->sql_get = "
    SELECT *
    FROM Centers
    WHERE id_center = :id_object
    ";
  }
}
