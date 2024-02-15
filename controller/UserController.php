<?php
class users
{


    public function __construct()
    {
    }

    

    public function RegisterUser()
    {
        try {
            // Crear una instancia de la clase PDO
            $conexion = new Conexion();
            $pdo = $conexion->obtenerConexion();

            // Preparar la sentencia SQL de inserción
            $sentencia = $pdo->prepare("INSERT INTO users (mail, user,name,password,key)" .
                "VALUES (:mail, :user , :name , :password , :sal )");

            $mail = $_POST["mail"];
            $user = $_POST["user"];
            $name = $_POST["name"];
            $password = $_POST["password"];

            $sal = bin2hex(random_bytes(16));

            $passwordEncrypt = hash('sha256', $sal . $password);


            // Ejecutar la sentencia SQL con los valores correspondientes
            $sentencia->execute(array(':mail' => $mail, ':user' => $user, ':name' => $name, ':password' => $passwordEncrypt, ':sal' => $sal));


            return "Registro exitoso.";
        } catch (PDOException $e) {
            return "Error de conexión: " . $e->getMessage();
        }

        // $statement = $pdo->prepare("SELECT * FROM products");
        // $statement->execute();
        // $resultado = $statement->fetchAll();

        // echo $resultado;


        // return json_encode($resultado);

        // Iterar sobre el resultado
    }
}
