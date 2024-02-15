<?php

switch ($_SERVER["REQUEST_METHOD"]  ) {
    case "post":
        switch ($_POST["accion"]) {
            case "RegiterUser":
                $users = new users();
                $registerUser = $users ->RegisterUser();
            return $registerUser;
        }
        break;
    case "get":
        echo "i es igual a 1";
        break;
}

