<?php

require_once __DIR__  . '/../helper.php';
require_once __DIR__ . '/../Models/Languages.php';
class LanguagesService
{
    private $languages;

    public function __construct()
    {
        $this->languages = new Languages();
    }

    public function getAll()
    {
        return $this->languages->getAll();
    }

    public function getById($id)
    {
        return $this->languages->getById($id);
    }

    public function getByCode($code)
    {
        return $this->languages->getByCode($code);
    }
}
