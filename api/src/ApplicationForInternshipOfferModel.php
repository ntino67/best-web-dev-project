<?php

class ApplicationForInternshipOfferModel extends Model {
    public function __construct()
    {
        parent::__construct();

        $this->insert_params = ["id_user", "CV", "motivation_letter"];

        $this->use_paging = false;

        $this->use_parent_id = true;

        $this->sql_getAll = "
        SELECT * 
        FROM Applications
        WHERE id_internship_offer = :id_parent
    ";

        $this->sql_get = "
        SELECT * 
        FROM Applications
        WHERE id_internship_offer = :id_parent
        AND id_user = :id_object
    ";

        $this->sql_create = "
        INSERT INTO Applications (id_user, id_internship_offer, CV, motivation_letter) 
        VALUES (:id_user, :id_parent, :CV, :motivation_letter)
    ";

        $this->sql_delete = "
        DELETE FROM Applications 
        WHERE id_internship_offer = :id_parent 
        AND id_user = :id_object
    ";
    }
}
