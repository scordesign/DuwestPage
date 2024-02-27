<?php
class Conexion {
    private $host = 'localhost:8889';
    private $usuario = 'root';
    private $contrasena = 'root';
    private $nombre_bd = 'duwest_main';
    private $conexion;

    public function __construct() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->nombre_bd}";
            $opciones = array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            );
            $this->conexion = new PDO($dsn, $this->usuario, $this->contrasena, $opciones);
        } catch (PDOException $e) {
            echo "Error de conexión: " . $e->getMessage();
            die();
        }
    }

    public function obtenerConexion() {
        return $this->conexion;
    }
}
?>