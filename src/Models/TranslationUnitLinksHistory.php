<?php

require_once __DIR__ . '/../Database.php';

class TranslationUnitLinksHistory {

    private $pdo;

    public function __construct()
    {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
    }
}
