<?php

require_once(__DIR__ . '/vendor/autoload.php');

$loader = new Twig\Loader\FilesystemLoader(__DIR__ . '/components');

$twig = new Twig\Environment($loader);

$data = [
  "page_title" => "Legal information",
  "page_header" => "Legal information",
  "content" => "This is the legal information page"
];

echo $twig->render('infoDocument.html', $data);
