# 📝 Translator Task

This project allows users to:
- Select a source and target language.
- Enter a title and upload Word documents as content.
- Automatically store the content and submit it to an API using `FormData`.
- Restrict file types to `.doc` and `.docx`.

## 📁 Project Structure (only main file listed here)

```
/src
 ├── components
 │    └── render-fields    
                └── RenderFields.tsx      # Form component with dynamic field rendering
 ├── pages
 │    └── translation           # Main page
              └── Translations.tsx 
 └── services
      └── Translations.service.ts              # API request handler
```

## 🚀 How to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/strategic-agenda/robert-php-dev-test
checkout hardik-dev
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env` file in the root directory and set your API base URL:

```bash
VITE_ENCRYPTION_KEY="robert-frontend-remember-me-key"
VITE_DEV_API_URL="http://192.168.1.19:7000/api/"
```

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:5173](http://localhost:5173) to open the app.

## 📤 API Payload Structure

The form submits data using `FormData` with this structure:

```json
{
  "title": "Document Title",
  "source_language_id": "1",
  "target_language_id": "2",
  "content": File
}
```

## 🔐 File Validation

- Only `.doc`, `.docx` files are allowed.
- Client-side validation is implemented to restrict unsupported file types.

## ✅ Features

- React Hook Form integration.
- Tailwind styling and form controls.
- File upload with MIME type validation.
- Global error handler

## 📦 Build for Production

```bash
npm run build
npm run start
```