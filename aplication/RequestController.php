<?php
require_once ('controller/ProductsController.php');
require_once ('controller/UserController.php');
require_once ('connection/Connection.php');


switch (strtolower($_SERVER["REQUEST_METHOD"])) {
    case "post":
        
        switch ($_POST["action"]) {
            case "RegiterUser":
                
                $users = new users();
                $registerUser = $users ->RegisterUser();
            echo $registerUser;
        }
        break;
    case "get":
        echo "i es igual a 1";
        break;
}

