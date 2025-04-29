<?php

require_once __DIR__ . '/../cors.php';
require_once __DIR__ . '/../../src/Services/TranslationsService.php';
require_once __DIR__ . '/../../src/Validation.php';

$translationService = new TranslationsService();
$languageService = new LanguagesService();

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriParts = explode('/', $uri);

if ($method === 'GET') {
    handleGetRequest($uriParts, $translationService);
} elseif ($method === 'POST' && strpos($uri, '/api/translations') === 0) {
    $id = isset($uriParts[3]) && is_numeric($uriParts[3]) ? $uriParts[3] : null;

    if ($id === null) {
        if (isset($_FILES['content']) && $_FILES['content']['error'] === 0) {
            $tmpPath = $_FILES['content']['tmp_name'];
            $fileName = $_FILES['content']['name'];
            $uploadDir = __DIR__ . '/uploads/';
            $destination = $uploadDir . basename($fileName);

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            if (move_uploaded_file($tmpPath, $destination)) {
                $content = getWordContent($destination);
                $_POST['content'] = $content;
            } else {
                http_response_code(422);
                echo errorResponse('Validation failed', ['errors' => "Failed to move uploaded file."], 422);
                return;
            }
        } else {
            http_response_code(422);
            echo errorResponse('Validation failed', ['errors' => "No file uploaded or there was an upload error."], 422);
            return;
        }
    }

    handlePostRequest($id, $_POST, $translationService, $languageService);
} else {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid endpoint or method']);
}


function handleGetRequest($uriParts, $translationService)
{
    if (isset($uriParts[3]) && !empty($uriParts[3]) && is_numeric($uriParts[3])) {
        $translation = $translationService->getById($uriParts[3]);
        if ($translation) {
            echo successResponse('Translation fetched successfully', $translation);
        } else {
            http_response_code(404);
            echo errorResponse('Translation not found', null);
        }
    } else {
        $skip = $_GET['skip'] ?? 0;
        $limit = $_GET['limit'] ?? 10;
        $translations = $translationService->getAll($skip, $limit);
        $data = [
            'translations' => $translations['data'],
            'total_records' => $translations['total_records']
        ];
        echo successResponse('Translations fetched successfully', $data);
    }
}

function handlePostRequest($id, $request, $translationService, $languageService)
{
    // Validation
    $errors = Validation::validateTranslation($request);
    if (!empty($errors)) {
        http_response_code(422);
        echo errorResponse('Validation failed', ['errors' => $errors], 422);
        return;
    }

    $sourceLang = $languageService->getById($request['source_language_id']);
    $errors = Validation::validateLanguageMatch($request['content'], $sourceLang['CODE']);
    if (!empty($errors)) {
        http_response_code(422);
        echo errorResponse('Validation failed', ['errors' => $errors], 422);
        return;
    }

    $response = $id
        ? $translationService->update($id, $request)
        : $translationService->store($request);

    if ($response) {
        http_response_code($id ? 200 : 201);
        echo successResponse(
            $id ? 'Translation updated successfully' : 'Translation created successfully',
            null
        );
    } else {
        http_response_code(500);
        echo errorResponse('Failed to ' . ($id ? 'update' : 'create') . ' translation', null, 500);
    }
}
