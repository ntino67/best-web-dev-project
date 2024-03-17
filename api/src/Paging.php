<?php

class Paging {

  // @return array<int, int> Offset and limit values calculated from the querystring
  public static function get() : array {
    // Page number
    $page = isset($_GET['page']) // Check if value is valid
      && is_numeric($_GET['page'])
      && ((int) $_GET['page']) > 0
      ? (int) $_GET['page'] // Return this if valid
      : 1; // Return this if not valid
    
    // Amount of elements per page
    $limit = isset($_GET['per_page'])
      && is_numeric($_GET['per_page'])
      && ((int) $_GET['per_page']) > 0
      && ((int) $_GET['per_page']) <= 200
      ? (int) $_GET['per_page']
      : 200;

    $offset = ($page - 1) * $limit;

    return array($offset, $limit);
  }
}
