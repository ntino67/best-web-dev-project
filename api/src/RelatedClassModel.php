<?php

// Get the classes a user is related to
class RelatedClassModel extends Model{

  private PDO $conn;

  public function __construct()
  {
      parent::__construct();

      $this->insert_params = ["id_class"];

      $this->use_paging = false;

      $this->use_parent_id = true;

      $this->sql_getAll = "
      SELECT C.id_class as id_class, class_year as class_name
      FROM Related_to_class
              JOIN web_project.Classes C on C.id_class = Related_to_class.id_class
      WHERE id_user = :id_parent
      ";

      $this->sql_get = "
      SELECT C.id_class as id_class, class_year as class_name
      FROM Related_to_class
              JOIN web_project.Classes C on C.id_class = Related_to_class.id_class
      WHERE id_user = :id_parent
        AND C.id_class = :id_object
      "; 

      $this->sql_create = "
      INSERT INTO Related_to_class (id_user,
                                  id_class)
      VALUES (:id_parent,
              :id_class)
      ";

      $this->sql_delete = "
      DELETE
      FROM Related_to_class
      WHERE id_user = :id_parent
        AND id_class = :id_object
      ";
  }
} 
