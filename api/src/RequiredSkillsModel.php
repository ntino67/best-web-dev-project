<?php

class RequiredSkillsModel extends Model {
  public function __construct()
  {
    parent::__construct();
    
    // Create is not supported, so insert_params is left empty
    $this->insert_params = ["id_skill"];
    
    $this->use_paging = true;

    $this->use_parent_id = true;

    $this->sql_getAll = "
    SELECT Required_Skills.id_skill, skill_name
    FROM Required_Skills
            JOIN web_project.Skills S on S.id_skill = Required_Skills.id_skill
    WHERE id_internship_offer = :id_parent
    ";
    
    $this->sql_get = "
    SELECT Required_Skills.id_skill, skill_name
    FROM Required_Skills
            JOIN web_project.Skills S on S.id_skill = Required_Skills.id_skill
    WHERE id_internship_offer = :id_parent
    AND Required_Skills.id_skill = :id_object
    ";

    $this->sql_create = "
    INSERT INTO Required_Skills (id_internship_offer,
                                 id_skill)
    VALUES (:id_parent,
            :id_skill)
    ";

    $this->sql_delete = "
    DELETE FROM Required_Skills
    WHERE id_internship_offer = :id_parent
    AND id_skill = :id_object
    ";
  }
}
