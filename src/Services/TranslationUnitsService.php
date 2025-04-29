<?php

require_once __DIR__ . '/../Models/TranslationUnit.php';

class TranslationUnitsService {
    
    private $tanslationUnit;

    public function __construct()
    {
        $this->tanslationUnit = new TranslationUnit();
    }

    public function store($data){
        return $this->tanslationUnit->store($data);
    }

    public function findExistingUnit($source_text, $source_language_id, $target_language_id){
        return $this->tanslationUnit->findExistingUnit($source_text, $source_language_id, $target_language_id);
    }
}
