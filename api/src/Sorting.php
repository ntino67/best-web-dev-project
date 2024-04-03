<?php

class Sorting
{
  // Get the current value of orderby in the querystring
  // The first value in the allowedList is the default value
  // @param $allowedList The allowed values for orderby, a value to replace by needs to be specified
  public static function getFromQueryString(array $allowedList) : string
  {
    if (!isset($_GET['orderby'])) { return $allowedList[array_key_first($allowedList)]; }
    
    $data = explode(" ", $_GET['orderby']);

    // Get the value of orderby
    $orderBy = isset($data[0])
      && array_key_exists($data[0], $allowedList)
      ? $allowedList[$data[0]]
      : $allowedList[array_key_first($allowedList)];
    
    // Get the order direction
    $orderDir = isset($data[1])
      && in_array($data[1], ["ASC", "DESC"])
      ? $data[1]
      : "ASC";

    return $orderBy . " " . $orderDir;
  } 
}
