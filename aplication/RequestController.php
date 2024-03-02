<?php
session_start();
require_once('controller/ProductsController.php');
require_once('controller/UserController.php');
require_once('controller/FilterController.php');
require_once('controller/sessionController.php');

require_once('connection/Connection.php');


$users = new users();
$Products = new Products();
$Filters = new Filters();
$session = new session();

switch (strtolower($_SERVER["REQUEST_METHOD"])) {
    case "post":

        switch ($_POST["action"]) {
            case "RegiterUser":
                echo $users->RegisterUser();
                break;
            case "LoggingUser":
                echo $users->LogUser();
                break;
            case "addProduct":
                echo $Products->addProducts();
                break;
        }
        break;
    case "get":
        switch ($_GET["action"]) {
            case "getSession":
                $session-> getSession();
                break;
            case "destroySession":
                echo  $session-> destroySession();
                break;
            case "getfilters":
                echo $Filters->getFilters();
                break;
        }

        break;
}

