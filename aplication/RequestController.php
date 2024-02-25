<?php
session_start();
require_once('controller/ProductsController.php');
require_once('controller/UserController.php');
require_once('connection/Connection.php');

$users = new users();
switch (strtolower($_SERVER["REQUEST_METHOD"])) {
    case "post":

        switch ($_POST["action"]) {
            case "RegiterUser":
                echo $users->RegisterUser();
                break;
            case "LoggingUser":
                echo $users->LogUser();
                break;
        }
        break;
    case "get":
        switch ($_GET["action"]) {
            case "getSession":
                getSession();
                break;
            case "destroySession":
                echo destroySession();
                break;
        }

        break;
}

function getSession(): string
{
    if (session_status() != PHP_SESSION_NONE) {
        $return = json_encode($_SESSION);
        echo $return;
        return $return;
    }
    return "";
}

function destroySession(): String
{
    if (session_status() != PHP_SESSION_NONE) {
        reset($_SESSION);
        session_destroy();
        return "true";
    }
    return "false";
}
