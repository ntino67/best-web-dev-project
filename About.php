<?php

require_once(__DIR__ . '/vendor/autoload.php');

$loader = new Twig\Loader\FilesystemLoader(__DIR__ . '/components');

$twig = new Twig\Environment($loader);

$data = [
  "page_title" => "About us",
  "page_header" => "About us",
  "content" => "This is the about us page"
];

echo $twig->render('infoDocument.html', $data);
