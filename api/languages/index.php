<?php

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../src/Services/LanguagesService.php';

$languagesService = new LanguagesService();
$method = $_SERVER['REQUEST_METHOD'];
$uriParts = explode('/', parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

if ($method === 'GET') {
    $languageParam = $uriParts[3] ?? null;

    if ($languageParam) {
        $unit = is_numeric($languageParam)
            ? $languagesService->getById($languageParam)
            : $languagesService->getByCode($languageParam);

        if ($unit) {
            echo successResponse('Language Fetched Successfully', $unit);
        } else {
            http_response_code(404);
            echo errorResponse('Language Not Found', null, 404);
        }
    } else {
        $units = $languagesService->getAll();
        echo successResponse('Languages Fetched Successfully', $units);
    }
} else {
    echo json_encode(['message' => 'Invalid endpoint or method']);
}
