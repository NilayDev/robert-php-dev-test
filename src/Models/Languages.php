<?php

require_once __DIR__ . '/../Database.php';

class Languages
{
    private $pdo;

    public function __construct()
    {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT * FROM languages");
        return $stmt->fetchAll();
    }

    public function getById($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM languages WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function getByCode($code)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM languages WHERE code = ?");
        $stmt->execute([$code]);
        return $stmt->fetch();
    }
}
