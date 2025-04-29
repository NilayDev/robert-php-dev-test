# Computer-Assisted Translation Tool

## Table of Contents
- [Introduction](#introduction)
- [Features](#Features)
- [Prerequisites](#Prerequisites)
- [Installation](#Installation)
- [Language Translation API](#Language-Translation-API)
- [How It Works](#How-It-Works)
- [Example](#Example)

# Translation System

## Introduction

This system allows users to easily translate content from any available language to another by uploading a DOCX file. Upon upload, the system extracts phrases from the document and translates them into the target language using the **Google Cloud Translation API**. 

The system provides a simple interface to view, edit, and check the translated phrases, with support for pagination to handle large sets of data efficiently. It also ensures that the selected source language matches the content of the document. If there is a mismatch between the detected source language and the provided text, an error message is displayed to prevent incorrect translations.

Additionally, when editing a translation unit, the system checks and updates the phrases. If an existing unit is deleted, the system preserves the previous version by storing it in a **history table**.

## Features

- Upload DOCX files for translation
- Automatic extraction of phrases from the content
- Translation of phrases into any target language using Google Cloud Translation API
- Source language detection and error handling if there’s a mismatch
- Edit and manage translations
- Pagination support for large data sets
- Versioning: Deleted units are archived in a history table for future reference
- User-friendly interface for checking and editing translations

## Prerequisites

Before you begin, ensure that you have met the following requirements:

- PHP >= 8.2
- Composer (for dependency management)
- Google Cloud account with the Translate API enabled
- A MySQL database for data storage

## Installation 

- ```run composer install```
- ```run php -S localhost:8000``` (for run the project)
- ```./vendor/bin/phpunit``` (for run the test cases)


# Language Translation API

A simple PHP API to manage languages and upload DOCX files for translation content extraction and processing.


## 📌 Endpoints

### `GET /api/languages`

Fetch all available languages.

### `GET /api/languages/{id|code}`
Fetch a language by ID or code.

---

### `GET /api/translations`
Fetch paginated list of translations.  
**Query Params:** `skip`, `limit`

---

### `POST /api/translations`  
Upload a DOCX file and submit translation.

**Form Data (multipart/form-data):**
- `content`: DOCX file
- `source_language_id`: ID of the source language
- `target_language_id`: ID of the target language
- `title`: Title of the document

---

## ✅ Validation

- Ensures required fields are present.
- Validates uploaded DOCX file.
- Detects and checks that the file's language matches the selected source language.

---

### `POST /api/translations/{id}`  

Edit translation unit 

**Form Data :**
- `content`: Source text
- `source_language_id`: ID of the source language
- `target_language_id`: ID of the target language
- `title`: Title of the document


## 🧠 How It Works

1. **Upload DOCX**  
   Users upload a DOCX file containing text content for translation.

2. **Phrase Extraction & Detection**  
   The system extracts phrases/sentences and uses the Google Translate API to detect the source language.

3. **Validation**  
   The system checks if the declared language matches the detected language and shows an error if not.

4. **Translation**  
   The content is translated to selected target languages and saved as translation units.

5. **Review & Edit**  
   Users can browse, edit translated units via a paginated interface.

6. **Version History**  
   If a translation unit is modified or deleted, the system saves a copy to a `translation_unit_links_history` table.


## 📌 Example: Translating French to English

This section demonstrates how the system processes and translates text from one language to another.

### 1. 📄 Original Content

```text
Bonjour, je m'appelle Marie. J'habite à Paris et je travaille comme enseignante.
```

### 2. 🌍 Language Information

- **Source Language**: French (`fr`)
- **Target Language**: English (`en`)

---

### 3. 🔍 Phrase Extraction and Translation

| # | Original Phrase (French)                                          | Translated Phrase (English)                     |
|---|-------------------------------------------------------------------|-------------------------------------------------|
| 1 | Bonjour, je m'appelle Marie.                                     | Hello, my name is Marie.                        |
| 2 | J'habite à Paris et je travaille comme enseignante.              | I live in Paris and I work as a teacher.        |


> ✅ Translations can be edited manually and version history will be retained.