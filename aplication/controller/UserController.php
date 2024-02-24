<?php
require_once(__DIR__ .'/../model/returnModel.php');
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
            $stmt = $pdo->prepare("INSERT INTO users (`mail`, `user`,`name`,`password`,`key`) VALUES (:mail , :user , :name , :password , :sal )");

            $mail = $_POST["mail"];
            $user = $_POST["user"];
            $name = $_POST["name"];
            $password = $_POST["password"];

            $sal = bin2hex(random_bytes(16));

            $passwordEncrypt = hash('sha256', $sal . $password);

            $stmt->bindParam(':mail', $mail);
            $stmt->bindParam(':user', $user);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':password', $passwordEncrypt);
            $stmt->bindParam(':sal', $sal);
            // Ejecutar la sentencia SQL con los valores correspondientes
            $stmt->execute();

            $returnModel = new returnModel(200,null,"logueado correctamente");

            var_dump($returnModel);

            $returnModelUsuario = json_encode($returnModel);
            echo $returnModelUsuario;
        } catch (PDOException $e) {

            $returnModel = new returnModel(500,null,$e->getMessage());

           
            $returnModelUsuario = json_encode($returnModel);
            echo $returnModelUsuario;
        }

        // $statement = $pdo->prepare("SELECT * FROM products");
        // $statement->execute();
        // $resultado = $statement->fetchAll();

        // echo $resultado;


        // return json_encode($resultado);

        // Iterar sobre el resultado
    }
}
