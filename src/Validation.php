<?php

class Validation
{

    public static function validateTranslation($request)
    {
        foreach (['title', 'source_language_id', 'target_language_id', 'content'] as $field) {
            if (empty($request[$field])) {
                return str_replace("_", " ", $field) . ' is required';
            }
        }

        return '';
    }

    public static function validateLanguageMatch($content, $sourceLanguageCode)
    {
        $actualLangCode = detectLanguage($content);
        return $actualLangCode !== $sourceLanguageCode ? 'The content language does not match the selected source language' : '';
    }
}
