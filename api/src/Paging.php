<?php

class Paging {


  // @return array<int, int> Page and per_page values read from the querystring
  private static function getFromQueryString() : array {
    $page = isset($_GET['page']) // Check if value is valid
      && is_numeric($_GET['page'])
      && ((int) $_GET['page']) > 0
      ? (int) $_GET['page'] // Return this if valid
      : 1; // Return this if not valid

    // Amount of elements per page
    $per_page = isset($_GET['per_page'])
      && is_numeric($_GET['per_page'])
      && ((int) $_GET['per_page']) > 0
      && ((int) $_GET['per_page']) <= 200
      ? (int) $_GET['per_page']
      : 20;

    return array($page, $per_page);
  }

  // @return array<int, int> Offset and limit values calculated from the querystring
  public static function getValues() : array {
    list($page, $limit) = self::getFromQueryString();

    $offset = ($page - 1) * $limit;

    return array($offset, $limit);
  }
  
  // @param mixed[] $input The results from an SQL query, containing a total_count key
  // @return mixed[] The results with the paging information appended and the total_count key is removed
  public static function appendToResults(array $input) : array {
    
   // Get page and per_page 
    list($page, $per_page) = self::getFromQueryString();
    
    // Calculate total_pages from the first row of the input
    $total_pages = $input ? ceil($input[0]['total_count'] / $per_page) : $page;
    
    // Remove total_count from each row
    forEach($input as $row => $value) {
      unset($input[$row]['total_count']);
    }

    $results = array();

    // Put the input into a new array under the key "data"
    $results["data"] = $input;
    
    // Append paging information under the key "paging"
    $results["paging"] = [
      "page" => $page,
      "per_page" => $per_page,
      "total_pages" => $total_pages
    ];

    return $results;
  }
}
