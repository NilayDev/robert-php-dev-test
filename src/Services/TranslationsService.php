<?php

require_once __DIR__  . '/../helper.php';
require_once __DIR__ . '/../Database.php';
require_once __DIR__ . '/../Models/Translations.php';
require_once __DIR__ . '../LanguagesService.php';
require_once __DIR__ . '../TranslationUnitsService.php';
require_once __DIR__ . '../TranslationUnitLinksService.php';

class TranslationsService
{
    private $pdo;
    private $translation;
    private $languageService;
    private $translationUnitsService;
    private $translationUnitLinksService;

    public function __construct()
    {
        $db = Database::getInstance();
        $this->pdo = $db->getConnection();
        $this->translation = new Translations();
        $this->languageService = new LanguagesService();
        $this->translationUnitsService = new TranslationUnitsService();
        $this->translationUnitLinksService = new TranslationUnitLinksService();
    }


    public function getAll($skip, $limit)
    {
        return $this->translation->getAll($skip, $limit);
    }

    public function store($request)
    {
        $this->pdo->beginTransaction();
        try {

            $title = $request['title'];
            $content = $request['content'];
            $sourceLangId = $request['source_language_id'];
            $targetLangId = $request['target_language_id'];

           $translationId = $this->translation->store($title, $sourceLangId, $targetLangId);

            if (!$translationId) {
                return false;
            }

            $phrases = extractPhrasesFromContent($content);

            foreach ($phrases as $phrase) {
                $translation_unit_id = $this->translationUnitsService->findExistingUnit($phrase, $sourceLangId, $targetLangId);

                if (empty($translation_unit_id)) {
                    $source_lang = $this->languageService->getById($sourceLangId);
                    $target_lang = $this->languageService->getById($targetLangId);
                    $translated_text = translateText($phrase, $source_lang['CODE'], $target_lang['CODE']);

                    if (!empty($translated_text)) {
                        $translation_unit_id = $this->translationUnitsService->store([
                            'source_text' => $phrase,
                            'translated_text' => $translated_text,
                            'source_language_id' => $sourceLangId,
                            'target_language_id' => $targetLangId,
                        ]);
                    }
                }

                if (!empty($translation_unit_id)) {
                    $this->translationUnitLinksService->store(
                        $translationId,
                        $translation_unit_id
                    );
                }
            }

            $this->pdo->commit();
            return true;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return false;
        }
    }

    public function update($id, $data)
    {
        $this->pdo->beginTransaction();

        try {

            $this->translation->update(
                $id,
                $data['title'],
                $data['source_language_id'],
                $data['target_language_id']
            );

            $existing_translation_unit_id = $data['translation_unit_id'] ?? null;
            $translation_unit_link = null;
            if (!empty($existing_translation_unit_id)) {
                $translation_unit_link = $this->translationUnitLinksService->getByTranslationIds($id, $existing_translation_unit_id);
            }

            $phrases = extractPhrasesFromContent($data['content']);
            $unit_ids = [];
            foreach ($phrases as $phrase) {
                $translation_unit_id = $this->translationUnitsService->findExistingUnit(
                    $phrase,
                    $data['source_language_id'],
                    $data['target_language_id']
                );

                if (empty($translation_unit_id)) {

                    $source_lang = $this->languageService->getById($data['source_language_id']);
                    $target_lang = $this->languageService->getById($data['target_language_id']);
                    $translated_text = translateText(
                        $phrase,
                        $source_lang['CODE'],
                        $target_lang['CODE']
                    );

                    $translation_unit_id = $this->translationUnitsService->store([
                        'source_text' => $phrase,
                        'translated_text' => $translated_text,
                        'source_language_id' => $data['source_language_id'],
                        'target_language_id' => $data['target_language_id'],
                    ]);
                }

                $exists = $this->translationUnitLinksService->getByTranslationIds($id, $translation_unit_id);
                if (!empty($translation_unit_id) && (empty($exists) || (!empty($exists) && $exists['translation_unit_link_id'] != $translation_unit_link['translation_unit_link_id']))) {
                    $unit_ids[] = $this->translationUnitLinksService->store($id, $translation_unit_id);
                }else{
                    $unit_ids[] = $exists['translation_unit_link_id'];
                }
            }

            if (!empty($unit_ids) && !empty($translation_unit_link) && !in_array($translation_unit_link['translation_unit_link_id'], $unit_ids)) {
                $this->translationUnitLinksService->delete($translation_unit_link['translation_unit_link_id']);
            }

            $this->pdo->commit();
            return true;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            return false;
        }
    }
}
