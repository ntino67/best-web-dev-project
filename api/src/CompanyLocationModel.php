<?php

class CompanyLocationModel extends Model
{
    public function __construct()
    {
        parent::__construct();

        // Create is not supported, so insert_params is left empty
        $this->insert_params = ["id_city"];

        $this->use_paging = true;

        $this->use_parent_id = true;

        $this->sql_getAll = "
        SELECT *
        FROM Situated
        WHERE id_company = :id_parent
        ";


        $this->sql_get = "
        SELECT *
        FROM Situated
        WHERE id_company = :id_parent
        AND id_city = :id_object
        ";

        $this->sql_create = "
        INSERT INTO Situated (id_company, id_city)
        VALUES (:id_parent, :id_city)
        ";

        $this->sql_delete = "
        DELETE FROM Situated
        WHERE id_company = :id_parent
        AND id_city = :id_object
        ";

    }
}

