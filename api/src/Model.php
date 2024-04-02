<?php

class Model {
  protected $sql_getAll = "";
  protected $sql_get = "";
  protected $sql_create = "";
  protected $sql_update = "";
  protected $sql_delete = "";

  # Data required when creating a new item
  protected array $insert_params = [];

  # Use paging
  protected bool $use_paging = true;

  # Use parent_id, example : only get wishlist items of a specific user id
  protected bool $use_parent_id = false;

  # Use filters
  protected bool $use_filters = false;

  # User sorting
  protected bool $use_sorting = false;
  
  # Allowed filters and sorting
  protected array $allowed_filters = [];
  protected array $allowed_sorting = [];
  
  # Database connection
  private PDO $conn;

  public function __construct() {
    $this->conn = Database::getConnection();
  }


  // Get all records

  public function getAll(string $parent_id = "") : array | false {
    $sql = $this->sql_getAll;

    if ($this->use_paging) {
      $sql .= " LIMIT :offset , :limit";
    }

    $statement = $this->conn->prepare($sql);
    
    // If a parent_id is required, check if it was provided
    if ($this->use_parent_id) {

      // Return false if the parent_id was not provided
      if (!$parent_id) { return false; }

      // Bind the parent_id to the statement
      $statement->bindValue(":id_parent", $parent_id, PDO::PARAM_INT);
    }

    if ($this->use_paging) {
      list($offset, $limit) = Paging::getValues();
      $statement->bindValue(":limit", $limit);
      $statement->bindValue(":offset", $offset);
    }
    
    $statement->execute();

    return $statement->fetchAll(PDO::FETCH_ASSOC);
  }


  // Get a specific record

  public function get(string $id_object, string $id_parent = "") : array | false {

    $sql = $this->sql_get;

    $statement = $this->conn->prepare($sql);

    if ($this->use_parent_id) {
      if (!$id_parent) { return false; }

      $statement->bindValue(":id_parent", $id_parent, PDO::PARAM_INT);
    }

    $statement->bindValue(":id_object", $id_object, PDO::PARAM_INT);

    $statement->execute();

    return $statement->fetch(PDO::FETCH_ASSOC);
  }


  // Create a new record

  // @param mixed[] $data
  public function create(array $data, string $id_parent = "") : int | false {
 
    // Check if the required data was provided and if a create statement was defined by the child class
    if (!$this->insert_params || $this->sql_create == "")
    { return false; }

    $sql = $this->sql_create;

    $statement = $this->conn->prepare($sql);
    
    // Insert the sumbitted data into the statement
    foreach ($this->insert_params as $i) {
      $statement->bindValue(":$i", $data[$i]);
    }

    // Insert parent_id if required
    if ($this->use_parent_id) {
      if (!$id_parent) { return false; }
      
      $statement->bindValue(":id_parent", $id_parent);
    }

    $statement->execute();

    return $this->conn->lastInsertId();
  }


  // Delete a record

  public function delete(string $id_object, string $id_parent = "") : int | false {
    if ($this->sql_delete == "")
    { return false; }

    $sql = $this->sql_delete;

    $statement = $this->conn->prepare($sql);

    if ($this->use_parent_id) {
      if (!$id_parent) { return false; }
      $statement->bindValue(":id_parent", $id_parent, PDO::PARAM_INT);
    }

    $statement->bindValue(":id_object", $id_object, PDO::PARAM_INT);

    $statement->execute();

    return $statement->rowCount();
  }
}

