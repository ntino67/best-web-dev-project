<?php

class UserModel extends Model
{
  public function __construct()
  {
    parent::__construct();

    $this->insert_params = ["first_name", "last_name", "email", "password", "id_center", "id_role"];

    $allowed_orderby = [
      "id_user" => "Users.id_user",
      "first_name" => "Users.first_name",
      "last_name" => "Users.last_name",
      "email" => "User.email",
      "center_name" => "C.center_name",
      "role_name" => "R.name"
    ];

    $orderby = Sorting::getFromQueryString($allowed_orderby);

    $allowed_filters = [
      "id_user" => ["type" => Filter::NUMBER, "replace" => "Users.id_user"],
      "first_name" => ["type" => Filter::STRING, "replace" => "Users.first_name"],
      "last_name" => ["type" => Filter::STRING, "replace" => "Users.last_name"],
      "email" => ["type" => Filter::STRING, "replace" => "Users.email"],
      "id_center" => ["type" => Filter::NUMBER, "replace" => "Users.id_center"],
      "center_name" => ["type" => Filter::STRING, "replace" => "C.center_name"],
      "id_role" => ["type" => Filter::NUMBER, "replace" => "Users.id_role"],
      "role_name" => ["type" => Filter::STRING, "replace" => "R.name"]
    ];
    
    $filter = Filter::getFromQueryString($allowed_filters);

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
    WHERE $filter user_active = 1 
    ORDER BY $orderby
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
    CALL web_project.uspAddUser(:email, :password, :first_name, :last_name, :id_center, :id_role, 1)
    ";


    $this->sql_update = "
    call web_project.uspUpdateUser(:id_object, :email, :password, :first_name, :last_name, :id_center, :id_role)
    ";


    $this->sql_delete = "
    UPDATE Users
    SET user_active = 0
    WHERE id_user = :id_object
    ";
  }
}
