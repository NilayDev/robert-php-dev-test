<?php

if (!function_exists('extractPhrasesFromContent')) {
    function extractPhrasesFromContent($content)
    {
        $content = preg_replace('/\s+/', ' ', $content);
        $content = trim($content);

        $punctuationMarks = ['.', '!', '?', ',', ';', ':', '-', '(', ')', '"', "'"];
        $punctuationPattern = '[' . preg_quote(implode('', $punctuationMarks), '/') . ']';

        $content = preg_replace('/(' . $punctuationPattern . ')(?=\S)/', '$1 ', $content);

        $pattern = '/(?<=[' . preg_quote(implode('', $punctuationMarks), '/') . '])\s+/';
        $units = preg_split($pattern, $content);

        $units = array_filter($units, fn($unit) => !empty(trim($unit)));

        return array_values($units);
    }
}

if (!function_exists('translateText')) {
    function translateText($text, $sourceLang, $targetLang)
    {
        $apiKey = "AIzaSyCVz2MurKJBKO7lJjuGYPXjlKzojihinMo";

        $url = "https://translation.googleapis.com/language/translate/v2?key=" . $apiKey;
        $fields = [
            'q' => $text,
            'source' => $sourceLang,
            'target' => $targetLang,
            'format' => 'text'
        ];

        $headers = [
            'Content-Type: application/json'
        ];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            return "Curl error: " . curl_error($ch);
        }
        curl_close($ch);

        $responseArray = json_decode($response, true);

        return $responseArray['data']['translations'][0]['translatedText'] ?? '';
    }
}

if (!function_exists('detectLanguage')) {
    function detectLanguage($text)
    {

        $apiKey = "AIzaSyCVz2MurKJBKO7lJjuGYPXjlKzojihinMo";

        $url = "https://translation.googleapis.com/language/translate/v2/detect?key=" . $apiKey;

        $fields = ['q' => $text];

        $headers = ['Content-Type: application/json'];

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            return 'Curl error: ' . curl_error($ch);
        }

        curl_close($ch);
        $responseArray = json_decode($response, true);

        return $responseArray['data']['detections'][0][0]['language'] ?? null;
    }
}

if (!function_exists('getWordContent')) {
    function getWordContent($filePath)
    {
        if (!file_exists($filePath) || pathinfo($filePath, PATHINFO_EXTENSION) !== 'docx') {
            return false;
        }

        $zip = new ZipArchive;
        if ($zip->open($filePath) === true) {
            $xmlContent = $zip->getFromName('word/document.xml');
            $zip->close();

            if ($xmlContent) {
                $xmlContent = str_replace('</w:p>', "\n", $xmlContent);
                $xmlContent = strip_tags($xmlContent);
                return $xmlContent;
            }
        }

        return false;
    }
}


if (!function_exists('successResponse')) {
    /**
     * Return a success response.
     *
     * @param string $message
     * @param mixed $data
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    function successResponse($message, $data = null, $code = 200)
    {
        return json_encode([
            'status' => 'success',
            'status_code' => $code,
            'message' => $message,
            'data' => $data,
        ]);
    }
}
if (!function_exists('errorResponse')) {
    /**
     * Return an error response.
     *
     * @param string $message
     * @param mixed $data
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    function errorResponse($message, $data = null, $code = 400)
    {
        return json_encode([
            'status' => 'error',
            'status_code' => $code,
            'message' => $message,
            'data' => $data,
        ]);
    }
}
