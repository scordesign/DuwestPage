<?php
    
class users
{


    public function __construct()
    {
    }

    public function LogUser() : String
    {
        $returnFields = array();

        try {

            $user = ($_POST["user"] === null) ? "" : $_POST["user"];
            $password = ($_POST["password"] === null) ? "" : $_POST["password"];


            if ($user == "" || $password == "") {
                $returnFields["status"] = 406;
                $returnFields["message"] = "usuario y contraseña requerida";

                $returnUsuario = json_encode($returnFields);
                return $returnUsuario;
                
            }

            

            // Crear una instancia de la clase PDO
            $conexion = new Conexion();
            $pdo = $conexion->obtenerConexion();

            // Consulta SQL
            $consulta = "SELECT * FROM users WHERE user = :user or mail = :user ";

            // Preparar la consulta
            $stmt = $pdo->prepare($consulta);

            // Asignar valores a los parámetros (en este caso, solo uno)

            $stmt->bindParam(':user', $user, PDO::PARAM_INT);

            // Ejecutar la consulta
            $stmt->execute();

            // Obtener los resultados
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC)[0];

            $resultado['user'];

            // Procesar los resultados
            if ($resultado['user'] == null) {
                $returnFields["status"] = 406;
                $returnFields["message"] = "Usuario no registrado";

                $returnUsuario = json_encode($returnFields);
                return $returnUsuario;
                
            }


             $passwordEncrypt = hash('sha256', $resultado['key'] . $password);

             if($passwordEncrypt !== $resultado['password'] ){
                $returnFields["status"] = 406;
                $returnFields["message"] = "Contraseña incorrecta";
    
                $returnUsuario = json_encode($returnFields);
                return $returnUsuario;
             }

                        

            $returnFields["status"] = 200;
            $returnFields["message"] = "ingreso correcto";

            $_SESSION['user'] = $resultado['user'];
            $_SESSION['name'] = $resultado['name'];
            $_SESSION['mail'] = $resultado['mail'];
            $_SESSION['started'] = true;


            $returnUsuario = json_encode($returnFields);
            return $returnUsuario;
            
        } catch (\Throwable  $e) {

            $returnFields["status"] = 500;
            $returnFields["message"] = $e->getMessage();

            $returnUsuario = json_encode($returnFields);
            return $returnUsuario;
        }
    }

    public function RegisterUser()  : String
    {
        $returnFields = array();

        try {

            $mail = ($_POST["mail"] === null) ? "" : $_POST["mail"];
            $user = ($_POST["user"] === null) ? "" : $_POST["user"];
            $name = ($_POST["name"] === null) ? "" : $_POST["name"];
            $password = ($_POST["password"] === null) ? "" : $_POST["password"];


            if ($mail == "" || $password == "") {
                $returnFields["status"] = 406;
                $returnFields["message"] = "correo electronico y contraseña requerida";

                $returnUsuario = json_encode($returnFields);
                return $returnUsuario;
            }

            $user = ($_POST["user"] == "") ? $_POST["mail"] : $_POST["user"];

            // Crear una instancia de la clase PDO
            $conexion = new Conexion();
            $pdo = $conexion->obtenerConexion();

            // Consulta SQL
            $consulta = "SELECT * FROM users WHERE user = :user and mail = :mail";

            // Preparar la consulta
            $stmt = $pdo->prepare($consulta);

            // Asignar valores a los parámetros (en este caso, solo uno)

            $stmt->bindParam(':user', $user, PDO::PARAM_INT);
            $stmt->bindParam(':mail', $user, PDO::PARAM_INT);

            // Ejecutar la consulta
            $stmt->execute();

            // Obtener los resultados
            $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Procesar los resultados
            if (count($resultado) > 0) {
                $returnFields["status"] = 406;
                $returnFields["message"] = "Usuario o correo electronico repetido";

                $returnUsuario = json_encode($returnFields);
                return $returnUsuario;
                
            }


            // Preparar la sentencia SQL de inserción
            $stmt = $pdo->prepare("INSERT INTO users (`mail`, `user`,`name`,`password`,`key`) VALUES (:mail , :user , :name , :password , :sal )");



            $sal = bin2hex(random_bytes(16));

            $passwordEncrypt = hash('sha256', $sal . $password);

            $stmt->bindParam(':mail', $mail);
            $stmt->bindParam(':user', $user);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':password', $passwordEncrypt);
            $stmt->bindParam(':sal', $sal);
            // Ejecutar la sentencia SQL con los valores correspondientes
            $stmt->execute();

            $returnFields["status"] = 200;
            $returnFields["message"] = "Creado exitosamente";

            $returnUsuario = json_encode($returnFields);
            return $returnUsuario;
        } catch (\Throwable  $e) {

            $returnFields["status"] = 500;
            $returnFields["message"] = $e->getMessage();

            $returnUsuario = json_encode($returnFields);
            return $returnUsuario;
        }
    }
}
