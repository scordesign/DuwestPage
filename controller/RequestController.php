<?php

switch ($_SERVER["REQUEST_METHOD"]  ) {
    case "post":
        echo"llego0";
        switch ($_POST["action"]) {
            case "RegiterUser":
                echo"llego1";
                $users = new users();
                $registerUser = $users ->RegisterUser();
            return $registerUser;
        }
        break;
    case "get":
        echo "i es igual a 1";
        break;
}

