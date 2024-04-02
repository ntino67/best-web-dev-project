<?php

class UserModel extends Model
{
  public function __construct()
  {
    parent::__construct();

    $this->insert_params = ["first_name", "last_name", "email", "password", "id_center", "id_role"];

    $this->use_paging = true;

    $this->use_parent_id = false;
    
    $this->sql_getAll = "
    SELECT id_user,
          first_name,
          last_name,
          email,
          C.id_center,
          C.center_name,
          R.id_role,
          R.name AS role_name,
          COUNT(*) OVER() AS total_count
    FROM Users
            JOIN web_project.Centers C on C.id_center = Users.id_center
            JOIN web_project.Roles R on R.id_role = Users.id_role
    WHERE user_active = 1
    ORDER BY Users.id_user
    ";

    $this->sql_get = "
    SELECT id_user,
          first_name,
          last_name,
          email,
          C.id_center,
          C.center_name,
          R.id_role,
          R.name AS role_name
    FROM Users
            JOIN web_project.Centers C on C.id_center = Users.id_center
            JOIN web_project.Roles R on R.id_role = Users.id_role
    WHERE user_active = 1
      AND id_user = :id_object
    ";

    $this->sql_create = "
    INSERT INTO Users (first_name,
                      last_name,
                      email, password,
                      user_created_at,
                      id_center,
                      id_role,
                      user_active)

    VALUES (:first_name,
            :last_name,
            :email,
            :password,
            CURRENT_TIMESTAMP,
            :id_center,
            :id_role,
            1);
    ";

    $this->sql_delete = "
    UPDATE Users
    SET user_active = 0
    WHERE id_user = :id_object
    ";
  }
}
