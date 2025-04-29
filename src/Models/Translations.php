<?php

require_once __DIR__ . '/../Database.php';

class Translations
{
    private $pdo;

    public function __construct()
    {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function totalRecords()
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) as total_records FROM translations");
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC)['total_records'] ?? 0;
    }public function getAll($skip = 0, $limit = 10)
    {
        $stmt = $this->pdo->prepare("
            SELECT 
                t.id AS translation_id,
                t.title,
                t.source_language_id,
                t.target_language_id,
                t.created_at AS translation_created_at,
                t.updated_at AS translation_updated_at,
                src_lang.name AS source_language,
                tgt_lang.name AS target_language,
                tu.id AS translation_unit_id,
                tu.source_text,
                tu.translated_text,
                tu.created_at AS translation_unit_created_at,
                tu.updated_at AS translation_unit_updated_at,
                COUNT(*) OVER() AS total_records
            FROM translations t
            INNER JOIN languages src_lang ON t.source_language_id = src_lang.id
            INNER JOIN languages tgt_lang ON t.target_language_id = tgt_lang.id
            LEFT JOIN translation_unit_links tul ON tul.translation_id = t.id
            LEFT JOIN translation_units tu ON tu.id = tul.translation_unit_id
            ORDER BY t.id DESC, tu.id DESC
            LIMIT :limit OFFSET :skip
        ");
    
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':skip', (int)$skip, PDO::PARAM_INT);
        $stmt->execute();
    
        $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        $total = isset($records[0]['total_records']) ? (int)$records[0]['total_records'] : 0;
    
        foreach ($records as &$row) {
            unset($row['total_records']);
        }
    
        return [
            'data' => $records,
            'total_records' => $total,
        ];
    }    


    public function getById($id)
    {
        $stmt = $this->pdo->prepare("
            SELECT 
                t.*, 
                src_lang.name AS source_language, 
                tgt_lang.name AS target_language,
                COUNT(tul.id) AS unit_count
            FROM translations t
            INNER JOIN languages src_lang ON t.source_language_id = src_lang.id
            INNER JOIN languages tgt_lang ON t.target_language_id = tgt_lang.id
            LEFT JOIN translation_unit_links tul ON tul.translation_id = t.id
            WHERE t.id = ?
            GROUP BY t.id
        ");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function store($title, $source_language_id, $target_language_id)
    {

        $stmt = $this->pdo->prepare("INSERT INTO translations (title, source_language_id, target_language_id) VALUES (?, ?, ?)");
        $stmt->execute([$title, $source_language_id, $target_language_id]);
        return $this->pdo->lastInsertId();
    }

    public function update($id, $title, $source_language_id, $target_language_id)
    {
        $stmt = $this->pdo->prepare("UPDATE translations SET title = ?, source_language_id = ?, target_language_id = ? WHERE id = ?");
        $stmt->execute([$title, $source_language_id, $target_language_id, $id]);
        return true;
    }
}
