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

            $directoryFile = "C:/Users/andres/Documents/prueba/" . $name . "/files";

            $directoryimage = "C:/Users/andres/Documents/prueba/" . $name . "/images";

            if (!is_dir($directoryFile)) {
                // Crear la carpeta con permisos 0777 (lectura, escritura y ejecución para todos)
                mkdir($directoryFile, 0777, true);

                // Establecer permisos adicionales si es necesario
                chmod($directoryFile, 0777);
            }

            if (!is_dir($directoryimage)) {
                // Crear la carpeta con permisos 0777 (lectura, escritura y ejecución para todos)
                mkdir($directoryimage, 0777, true);

                // Establecer permisos adicionales si es necesario
                chmod($directoryimage, 0777);
            }


            foreach ($files["name"] as $key => $nombre) {
                // Mover archivo al directorio deseado
                $rutaArchivo = $directoryFile . "/" . basename($files["name"][$key]);
                move_uploaded_file($files["tmp_name"][$key], $rutaArchivo);
                // Agregar nombre del archivo a la lista
                $filesNames[] = $directoryFile . "/" . basename($files["name"][$key]);
            }

            foreach ($images["name"] as $key => $nombre) {
                // Mover archivo al directorio deseado
                $rutaArchivo = $directoryimage . "/" . basename($images["name"][$key]);
                move_uploaded_file($images["tmp_name"][$key], $rutaArchivo);
                // Agregar nombre del archivo a la lista
                $imagesNames[] = $directoryimage . "/" . basename($images["name"][$key]);
            }
            $imagesNamesString = json_encode($imagesNames);
            $filesNamesString = json_encode($filesNames);
            
            $stmt = $pdo->prepare("INSERT INTO products (`name`,`description`,`listImg`,`listDocs`,`filters`,`section`) VALUES (:name,:description,:listImg,:listDocs,:filters,:section)");


            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':description', $description);
            $stmt->bindParam(':listImg', $imagesNamesString);
            $stmt->bindParam(':listDocs', $filesNamesString);
            $stmt->bindParam(':filters', $filters);
            $stmt->bindParam(':section', $section);
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
}
?>