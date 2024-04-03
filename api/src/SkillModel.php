<?php

class SkillModel extends Model {
  public function __construct()
  {
    parent::__construct();
    
    // Create is not supported, so insert_params is left empty
    $this->insert_params = [""];

    $this->use_paging = true;

    $this->use_parent_id = false;

    $this->sql_getAll = " 
    SELECT id_skill, skill_name, COUNT(*) OVER() AS total_count
    FROM Skills
    ";

    $this->sql_get = "
    SELECT id_skill, skill_name
    FROM Skills
    WHERE id_skill = :id_object
    ";
  }
}
