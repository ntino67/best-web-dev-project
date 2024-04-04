<?php

class DataValidator
{
  public const EMAIL = "/^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/";
  public const PASSWORD = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/";
  public const NAME = "/^[a-z ,.'-]+$/i";
  public const NOT_EMPTY = "/^(?!\s*$).+/";
  public const NUMBER = "int";
  public const DATE = "date";

  // @param mixed[] $data Data to be validated
  // @param mixed[] $pattern Regex patterns to check the data against, format : ["data-type" => "Regex", "data-type-2" => "Regex-2", ...]
  // @return mixed[] list of found errors
  public static function catchValidationErrors(array $data, array $pattern, int $errorCode) : void
  {
    $errors = array();

    foreach ($pattern as $key => $itemPattern) {
      // If the data is supposed to be an integer
      if ($itemPattern == self::NUMBER)
      {
        if (!array_key_exists($key, $data) || !is_int($data[$key])) 
        {
          $errors[] = "$key";
        }
      }
      
      // If the data is supposed to be a date
      else if ($itemPattern == self::DATE) {
        $d = DateTime::createFromFormat("Y-m-d", $data[$key]);
        
        if (!array_key_exists($key, $data) || $d == false || $d->format("Y-m-d") != $data[$key])
        {
          $errors[] = "$key";
        }
      }
      // If the data is supposed to be a type of string
      else if (!array_key_exists($key, $data) || !preg_match($itemPattern, $data[$key]) || strlen($data[$key]) > 255)
      {
        $errors[] = "$key";
      }
    }

    if (!empty($errors))
    {
      http_response_code($errorCode);
      echo json_encode(["dataErrors" => $errors]);
      exit(); 
    }

    return;
  }
}
