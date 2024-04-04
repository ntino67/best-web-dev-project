<?php

// Get the classes a user is related to
class UserWorkForModel extends Model{

    private PDO $conn;

    public function __construct()
    {
        parent::__construct();

        $this->insert_params = ["id_company","start_date", "end_date"];

        $this->use_paging = false;

        $this->use_parent_id = true;

        $this->sql_getAll = "
        SELECT * 
        FROM Works_for 
        WHERE id_user = :id_parent
      ";

        $this->sql_get = "
        SELECT * 
        FROM Works_for 
        WHERE id_user = :id_parent 
        AND id_company = :id_object
      ";

        $this->sql_create = "
        INSERT INTO Works_for (id_user, id_company, start_date, end_date)
        VALUES (:id_parent, :id_company, :start_date, :end_date)

      ";

        $this->sql_delete = "
        DELETE FROM Works_for
        WHERE id_user = :id_parent
        AND id_company = :id_object
      ";
    }
}
