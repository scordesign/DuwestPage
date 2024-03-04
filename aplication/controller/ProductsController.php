<?php
class Products
{


    public function __construct()
    {
    }


    public function addProducts(): string
    {
        $returnFields = array();
        try {
            $filesNames = array();
            $imagesNames = array();


            $conexion = new Conexion();
            $pdo = $conexion->obtenerConexion();

            $files = $_FILES["files"];
            $images = $_FILES["images"];

            if ($_POST["name"] === null) {
                $returnFields["status"] = 406;
                $returnFields["message"] = "Nombre de producto requerid";
                $return = json_encode($returnFields);
                return $return;
            }

            

            $filters = $_POST["filters"] === null ? "" : substr($_POST["filters"], 0, strlen($_POST["filters"]) - 1);
            $description = $_POST["description"] === null ? "" : $_POST["description"];
            $name = $_POST["name"] === null ? "" : $_POST["name"];
            $section = $_POST["section"] === null ? "" : $_POST["section"];
            $amount = $_POST["amount"] === null ? "" : $_POST["amount"];
            $imagesNamesString ="[]";

            if($images !== null){
                $directoryimage = str_replace("\aplication\controller", "", __DIR__)."/img/prueba/". $name . "/images";
                if (!is_dir($directoryimage)) {
                    // Crear la carpeta con permisos 0777 (lectura, escritura y ejecución para todos)
                    mkdir($directoryimage, 0777, true);
    
                    // Establecer permisos adicionales si es necesario
                    chmod($directoryimage, 0777);
                }
                foreach ($images["name"] as $key => $nombre) {
                    // Mover archivo al directorio deseado
                    $rutaArchivo = $directoryimage . "/" . basename($images["name"][$key]);
                    move_uploaded_file($images["tmp_name"][$key], $rutaArchivo);
                    // Agregar nombre del archivo a la lista
                    $imagesNames[] = /*$directoryimage .*/ "img/prueba/".$name . "/images/" . basename($images["name"][$key]);
                }
                $imagesNamesString = json_encode($imagesNames);
            }
            $filesNamesString = "[]";
            if($files !== null){
                $directoryFile = str_replace("\aplication\controller", "", __DIR__)."/img/prueba/" . $name . "/files";

                if (!is_dir($directoryFile)) {
                    // Crear la carpeta con permisos 0777 (lectura, escritura y ejecución para todos)
                    mkdir($directoryFile, 0777, true);
    
                    // Establecer permisos adicionales si es necesario
                    chmod($directoryFile, 0777);
                }

                foreach ($files["name"] as $key => $nombre) {
                    // Mover archivo al directorio deseado
                    $rutaArchivo = $directoryFile . "/" . basename($files["name"][$key]);
                    move_uploaded_file($files["tmp_name"][$key], $rutaArchivo);
                    // Agregar nombre del archivo a la lista
                    $filesNames[] =/* $directoryFile .*/ "img/prueba/" . $name . "/files/". basename($files["name"][$key]);
                }

                $filesNamesString = json_encode($filesNames);
            }
           
            
            $stmt = $pdo->prepare("INSERT INTO products (`name`,`description`,`listImg`,`listDocs`,`filters`,`section`,`amount`) VALUES (:name,:description,:listImg,:listDocs,:filters,:section,:amount)");


            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':listImg', $imagesNamesString);
            $stmt->bindParam(':listDocs', $filesNamesString);
            $stmt->bindParam(':filters', $filters);
            $stmt->bindParam(':section', $section);
            $stmt->bindParam(':amount', $amount);
            // Ejecutar la sentencia SQL con los valores correspondientes
            $stmt->execute();



            $returnFields["status"] = 200;
            $returnFields["message"] = "Registrado correctamente";

            $returnProduct = json_encode($returnFields);


            return json_encode($returnProduct);

        } catch (\Throwable $e) {
            $returnFields["status"] = 500;
            $returnFields["message"] = $e->getMessage();

            $returnProduct = json_encode($returnFields);


            return json_encode($returnProduct);
        }
        // Iterar sobre el resultado
    }

    public function getProducts(): string
    {
        $returnFields = array();
        try {
            $page = !isset($_GET["page"]) ? 1 : $_GET["page"];
            
            $filters = !isset($_GET["filters"])  ? "" : substr($_GET["filters"], 0, strlen($_GET["filters"]) - 1);
            $search =!isset($_GET["search"]) ? "" : $_GET["search"];

            $Ssql = "select * from products where ";
            if($search !== ""){
                $search = '%' . $search . '%';
                $Ssql .= "`name` = :name and ";
            }

            if($filters !== ""){
                $filters = str_replace("{", "%", $filters);
                    $filters = str_replace("}", "%", $filters);
                $filtersList = explode(",", $filters);
                $Ssql .= "(";
                foreach($filtersList as $filter){
                    $Ssql .= "`filters` = :filter"+str_replace("%", "", $filters)+" or ";
                }
                $Ssql = str_ends_with($Ssql , ' or ')? substr($Ssql, 0,strlen($Ssql) - 3):$Ssql;
                $Ssql .= ")";
            }
            $Ssql = str_ends_with($Ssql , ' and ')? substr($Ssql, 0,strlen($Ssql) - 4):$Ssql;
            $Ssql = str_ends_with($Ssql , ' where ')? substr($Ssql, 0,strlen($Ssql) - 6):$Ssql;

            $conexion = new Conexion();
            $pdo = $conexion->obtenerConexion();
            
            // count
            $statementCount = $pdo->prepare(str_replace(" * ", " count(*) as count ", $Ssql));

            if($search !== ""){
                $statementCount->bindParam(':name', $search , PDO::PARAM_STR);
            }

            if($filters !== ""){
                $filtersList = explode(",", $filters);
                foreach($filtersList as $filter){
                    $statementCount->bindParam( ":filter"+str_replace("%", "", $filters) , $filter, PDO::PARAM_STR);
                }
            }



            $statementCount->execute();
            $resultadoCount = $statementCount->fetchAll(PDO::FETCH_ASSOC);

            $count = $resultadoCount[0]["count"];
            

            // data
            $statement = $pdo->prepare($Ssql." LIMIT ". $page * 10 ." OFFSET 0" . ($page * 10) -10);

            if($search !== ""){
                $statement->bindParam(':name', $search , PDO::PARAM_STR);
            }

            if($filters !== ""){
                $filtersList = explode(",", $filters);
                foreach($filtersList as $filter){
                    $statement->bindParam( ":filter"+str_replace("%", "", $filters) , $filter, PDO::PARAM_STR);
                }
            }

            $statement->execute();
            $resultados = $statement->fetchAll(PDO::FETCH_ASSOC);
            $resultadosReturn = array();

             $i = 0;
            foreach($resultados as $resultado){
                $resultadosReturnEach = array();
                $resultadosReturnEach['listDocs'] = json_decode($resultado['listDocs'], true);
                $resultadosReturnEach['listImg'] = json_decode($resultado['listImg'], true);
                $resultadosReturnEach['name'] = $resultado['name'];
                $resultadosReturnEach['description'] = $resultado['description'];
                $resultadosReturnEach['amount'] = $resultado['amount'];
                $resultadosReturnEach['id'] = $resultado['id'];
                $resultadosReturn[$i] =  $resultadosReturnEach;
                $i++;
            }

            $returnFields["data"] = $resultadosReturn ;
            $returnFields["Page"] = $page;
            $returnFields["Total"] = $count;
            $returnFields["status"] = 200;
            $returnFields["message"] = "Correcto";

            $returnProduct = json_encode($returnFields);


            return json_encode($returnProduct);

        } catch (\Throwable $e) {
            $returnFields["status"] = 500;
            $returnFields["message"] = $e;
            $returnProduct = json_encode($returnFields);


            return json_encode($returnProduct);
        }
        // Iterar sobre el resultado
    }

    public function getProduct(): string
    {
        $returnFields = array();
        try {
            $id = !isset($_GET["id"]) ? 0 : $_GET["id"];
            
            $Ssql = "select * from products where id= :id";


            $conexion = new Conexion();
            $pdo = $conexion->obtenerConexion();
            
            $statement = $pdo->prepare($Ssql);

                $statement->bindParam(':id', $id , PDO::PARAM_INT);
            



            $statement->execute();
            $resultados = $statement->fetchAll(PDO::FETCH_ASSOC);
            $resultadosReturn = array();

            foreach($resultados as $resultado){
                $resultadosReturn = array();
                $resultadosReturn['listDocs'] = json_decode($resultado['listDocs'], true);
                $resultadosReturn['listImg'] = json_decode($resultado['listImg'], true);
                $resultadosReturn['name'] = $resultado['name'];
                $resultadosReturn['description'] = $resultado['description'];
                $resultadosReturn['amount'] = $resultado['amount'];
                $resultadosReturn['id'] = $resultado['id'];
            }

            $returnFields["data"] = $resultadosReturn ;

            $returnFields["status"] = 200;
            $returnFields["message"] = "Correcto";

            $returnProduct = json_encode($returnFields);


            return json_encode($returnProduct);

        } catch (\Throwable $e) {
            $returnFields["status"] = 500;
            $returnFields["message"] = $e;

            $returnProduct = json_encode($returnFields);


            return json_encode($returnProduct);
        }
        // Iterar sobre el resultado
    }
}
?>