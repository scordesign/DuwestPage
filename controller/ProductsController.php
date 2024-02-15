<?php
class Products
{


    public function __construct()
    {
    }

    public function obtenerConexion()
    {
        $conexion = new Conexion();
        $pdo = $conexion->obtenerConexion();

        $statement = $pdo->prepare("SELECT * FROM products");
        $statement->execute();
        $resultado = $statement->fetchAll();
        
        echo $resultado;


        return json_encode($resultado);

        // Iterar sobre el resultado
    }
}
?>