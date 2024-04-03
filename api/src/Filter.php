<?php

class Filter {
  public const STRING = 1;
  public const NUMBER = 2;

  // Get the current value of filter in the querystring
  // @Param $allowed_filters Allowed filter values and data types to determine allowed filters
  // Example : ["name" => Filter::STRING, "id" => Filter::NUMBER]
  // @return array<string, string> The filters read from the querystring
  public static function getFromQueryString(array $allowed_filters) : string {
    if (!isset($_GET['filter'])) { return ""; }
    
    $filterInput = explode(" and ", $_GET['filter']);
    $filterOutput = ""; 
    
    foreach ($filterInput as $filter) {
      $data = explode(" ", $filter);

      if (count($data) != 3) { continue; }

      $filterName = $data[0];

      $filterOperator = $data[1];

      $filterValue = $data[2];

      if (!array_key_exists($filterName, $allowed_filters)) { continue; }

      $filterType = $allowed_filters[$filterName]["type"];

      if ($filterType == self::STRING) 
      {
        $filterOutput .= self::convertStringFilter($allowed_filters[$filterName]["replace"], $filterOperator, $filterValue);
      } 
      else if ($filterType == self::NUMBER) 
      {
        $filterOutput .= self::convertNumberFilter($allowed_filters[$filterName]["replace"], $filterOperator, $filterValue);
      }

      if (!$filterOutput) { continue; }

      $filterOutput .= " AND ";
    }
    return $filterOutput;
  }

  private static function convertStringFilter(string $filterName, string $filterOperator, string $filterValue) : string {
    // Operators :: eq, neq, like, nlike, startswith, endswith
    switch ($filterOperator) {
    case "eq":
      return "$filterName = '$filterValue'";
    case "neq":
      return "$filterName != '$filterValue'";
    case "like":
      return "$filterName LIKE '%$filterValue%'";
    case "nlike":
      return "$filterName NOT LIKE '%$filterValue%'";
    case "startswith":
      return "$filterName LIKE '$filterValue%'";
    case "endswith":
      return "$filterName LIKE '%$filterValue'";
    default:
      return "";
    }
  }

  private static function convertNumberFilter(string $filterName, string $filterOperator, string $filterValue) : string {
    // Operators :: eq, neq, gt, gte, lt, lte
    switch ($filterOperator) {
    case "eq":
      return "$filterName = $filterValue";
    case "neq":
      return "$filterName != $filterValue";
    case "gt":
      return "$filterName > $filterValue";
    case "gte":
      return "$filterName >= $filterValue";
    case "lt":
      return "$filterName < $filterValue";
    case "lte":
      return "$filterName <= $filterValue";
    default:
      return "";
    }
  }
}
