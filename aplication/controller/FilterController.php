<?php
class Filters
{


    public function __construct()
    {
    }

    public function getFilters() : String
    {
        
        $returnFields = array();

        $conexion = new Conexion();
        $pdo = $conexion->obtenerConexion();

        $statement = $pdo->prepare("SELECT * FROM filters");
        $statement->execute();
        $resultado = $statement->fetchAll();
        

        $returnFields["data"] = $resultado;
        $returnFields["status"] = 200;
        $returnFields["message"] = "correcto";

        $returnProduct = json_encode($returnFields);


        return json_encode($returnProduct);

        // Iterar sobre el resultado
    }


}
?>