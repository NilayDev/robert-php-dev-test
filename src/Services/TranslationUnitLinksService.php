<?php

require_once __DIR__ . '/../Models/TranslationUnitLinks.php';

class TranslationUnitLinksService {
    
    private $tanslationUnitLink;

    public function __construct()
    {
        $this->tanslationUnitLink = new TranslationUnitLinks();
    }
    
    public function getByTranslationIds($translation_id, $translation_unit_id){
        return $this->tanslationUnitLink->getByTranslationIds($translation_id, $translation_unit_id);
    }

    public function store($translation_id,$translation_unit_id){
        return $this->tanslationUnitLink->store($translation_id, $translation_unit_id);
    }

    public function existsByTranslationIds($translation_id, $translation_unit_id){
        return $this->tanslationUnitLink->existsByTranslationIds($translation_id, $translation_unit_id);
    }

    public function delete($id){
        return $this->tanslationUnitLink->delete($id);
    }
}
