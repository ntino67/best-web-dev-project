<?php

class DataValidator 
{
  // @param mixed[] $data Data to be validated
  // @param mixed[] $pattern Regex patterns to check the data against, format : ["data-type" => "Regex", "data-type-2" => "Regex-2", ...]
  // @return mixed[] list of found errors
  public static function getStringErrors(array $data, array $pattern) : array
  {
    $errors = array();

    foreach ($pattern as $key => $pattern) {
      if (!array_key_exists($key, $data) || !preg_match($pattern, $data[$key]) || strlen($data[$key]) > 255) 
      {
      $errors[] = "Invalid $key";
      }
    }
    
    return $errors;
  }

  // @param mixed[] $data Data to be validated
  // @param mixed[] $pattern list of the keys that are supposed to be present in $data, format ["id_1", "id_2", ...]
  // @return mixed[] list of found errors
  public static function getIntegerErrors(array $data, array $pattern) : array
  {
    $errors = array();

    foreach ($pattern as $key) {
      if (!array_key_exists($key, $data) || !is_int($data[$key])) 
      {
      $errors[] = "Invalid $key";
      }
    }

    return $errors;
  }
}
