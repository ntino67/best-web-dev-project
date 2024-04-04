<?php

class RoleModel extends Model
{
    public function __construct()
    {
        parent::__construct();

        $this->insert_params = [""];

        $this->use_paging = true;

        $this->use_parent_id = false;

        $this->sql_getAll = "
        SELECT * FROM Roles
        ";

        $this->sql_get = "
        SELECT * FROM Roles
        WHERE id_role = :id_object
        ";
    }
}
