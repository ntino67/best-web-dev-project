<?php

class CompanyReviewModel extends Model
{
    public function __construct()
    {
        parent::__construct();

        // Create is not supported, so insert_params is left empty
        $this->insert_params = ["id_user", "review_text", "review_score"];

        $this->use_paging = true;

        $this->use_parent_id = true;

        $this->sql_getAll = "
        SELECT *
        FROM Company_Reviews
        WHERE id_company = :id_parent
        ";

        $this->sql_get = "
        SELECT *
        FROM Company_Reviews
        WHERE id_user = :id_object
        AND id_company = :id_parent
        ";

        $this->sql_create = "
        INSERT INTO Company_Reviews (id_company, id_user, review_text, review_score)
        VALUES(:id_parent, :id_user, :review_text, :review_score)
        ";
    }
}

