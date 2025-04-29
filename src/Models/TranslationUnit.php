<?php

require_once __DIR__ . '/../Database.php';

class TranslationUnit
{
    private $pdo;

    public function __construct()
    {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function store($data)
    {
        $stmt = $this->pdo->prepare("INSERT INTO translation_units (source_text, translated_text, source_language_id, target_language_id) VALUES (?, ?, ?, ?)");
        $stmt->execute([$data['source_text'], $data['translated_text'], $data['source_language_id'], $data['target_language_id']]);
        return $this->pdo->lastInsertId();
    }

    public function findExistingUnit($source_text, $source_language_id, $target_language_id)
    {
        $stmt = $this->pdo->prepare("
            SELECT id 
            FROM translation_units 
            WHERE source_text = ? 
            AND source_language_id = ? 
            AND target_language_id = ?
            LIMIT 1
        ");
        $stmt->execute([$source_text, $source_language_id, $target_language_id]);
        $unit = $stmt->fetch();
        return $unit ? $unit['id'] : null;
    }
}
