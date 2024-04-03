<?php

class ErrorHandler
{
  public static function handleException(Throwable $exception): void 
  {
    http_response_code(500);
    
    $errorInfo = array(
      "code" => $exception->getCode(),
      "message" => $exception->getMessage(),
    );

    if (Config::DEBUG) {
      $errorInfo["file"] = $exception->getFile();
      $errorInfo["line"] = $exception->getLine();
      /* $errorInfo["trace"] = $exception->getTrace(); */
    }

    echo json_encode($errorInfo);
  }

  public static function handleError(
    int $errno,
    string $errstr,
    string $errfile,
    int $errline,
  ): bool
  {
    throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
  }
}
