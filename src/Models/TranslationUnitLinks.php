<?php

require_once __DIR__ . '/../Database.php';

class TranslationUnitLinks
{

    private $pdo;

    public function __construct()
    {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function getByTranslationIds($translation_id, $translation_unit_id)
    {
        $stmt = $this->pdo->prepare("
            SELECT 
                tul.id as translation_unit_link_id,
                tu.id,
                tu.source_text,
                tu.translated_text,
                tu.created_at,
                tu.updated_at
            FROM translation_unit_links tul
            INNER JOIN translation_units tu ON tu.id = tul.translation_unit_id
            WHERE tul.translation_id = ? AND tul.translation_unit_id = ?
            LIMIT 1
        ");
        $stmt->execute([$translation_id, $translation_unit_id]);
        return $stmt->fetch();
    }

    public function existsByTranslationIds($translation_id, $translation_unit_id)
    {
        $stmt = $this->pdo->prepare("
            SELECT 1
            FROM translation_unit_links
            WHERE translation_id = ? AND translation_unit_id = ?
            LIMIT 1
        ");
        $stmt->execute([$translation_id, $translation_unit_id]);

        return $stmt->fetch() !== false;
    }

    public function store($translation_id, $translation_unit_id)
    {
        $stmt = $this->pdo->prepare("INSERT INTO translation_unit_links (translation_id, translation_unit_id) VALUES (?, ?)");
        $stmt->execute([$translation_id, $translation_unit_id]);
        return $this->pdo->lastInsertId();
    }

    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM translation_unit_links WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
    }
}
