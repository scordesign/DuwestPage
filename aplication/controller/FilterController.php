<?php
class Filters
{


    public function __construct()
    {
    }

    public function getFilters() : String
    {
        $returnFields = array();
        try {
            $conexion = new Conexion();
        $pdo = $conexion->obtenerConexion();

        $statement = $pdo->prepare("SELECT category FROM filters group by category");
        $statement->execute();

        $resultado = $statement->fetchAll(PDO::FETCH_ASSOC);

        
        
        $categorysFilters = array();

        foreach ($resultado as $category ) {
            $statementIn = null;
            $resultadoIn = null;
            $statementIn = $pdo->prepare("SELECT * FROM filters where `category` = :category");
            $statementIn->bindParam(':category', $category['category'] , PDO::PARAM_STR);
            $statementIn->execute();
            $resultadoIn = $statementIn->fetchAll(PDO::FETCH_ASSOC);
            $categorysFilters[$category['category']] = $resultadoIn;
        }

        $returnFields["data"] = $categorysFilters;
        $returnFields["status"] = 200;
        $returnFields["message"] = "correcto";

        $returnProduct = json_encode($returnFields);


        return json_encode($returnProduct);
        } catch (\Throwable $e) {
            echo var_dump($e);
            $returnFields["status"] = 500;
        $returnFields["message"] = $e->getMessage();

        $returnProduct = json_encode($returnFields);


        return json_encode($returnProduct);
        }
        

        

        // Iterar sobre el resultado
    }

}
?>