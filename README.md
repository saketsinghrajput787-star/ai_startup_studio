# FoundrAI 🚀 — AI Startup Studio

FoundrAI is an AI-powered startup studio designed to analyze, validate, and brainstorm startup ideas. It leverages **Google Gemini** for generative AI modeling and a **Retrieval-Augmented Generation (RAG)** pipeline utilizing **LangChain** and **Chroma DB** to consult a knowledge base of business & entrepreneurship wisdom when formulating startup feedback.

---

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance, async web framework for Python.
- **LangChain & LangChain-Chroma**: Orchestrating the RAG pipeline.
- **Google Gemini (Gemini 2.5 Flash)**: Generative LLM for processing suggestions and insights.
- **Chroma DB**: Vector database for storing and querying document chunks.

### Frontend
- **React (Vite)**: Modern, lightning-fast frontend building environment.
- **Tailwind CSS**: Core CSS styling framework for premium UI components.
- **Lucide React**: Clean Icon set.

---

## 📁 Project Structure

```text
├── assets/                  # Shared assets
├── backend/                 # FastAPI application
│   ├── app/                 # Backend source code
│   │   ├── api/             # API routes (Generate, Health, Upload, RAG)
│   │   ├── core/            # App core settings
│   │   ├── rag/             # Embeddings and vector DB handlers
│   │   ├── schemas/         # Pydantic data schemas
│   │   ├── services/        # Business logic services
│   │   └── main.py          # App entrypoint
│   ├── .env                 # Environment variables
│   └── requirements.txt     # Python dependencies
├── frontend/                # Vite React application
│   ├── src/                 # Frontend source code
│   │   ├── components/      # UI components (Navbar, Cards, etc.)
│   │   ├── pages/           # Pages (Home, etc.)
│   │   └── services/        # API client modules
│   └── package.json         # Node.js dependencies
└── knowledge_base/          # Predefined startup resources and markdown guides
```

---

## 🚀 Getting Started

### 1. Prerequisites Check
Ensure you have Pyton (3.9+) and Node.js (18+) installed on your local machine.

### 2. Run the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Set up a virtual environment (optional but recommended):
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `.env` (copy from `.env.example` as a template):
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   MODEL_NAME=gemini-2.5-flash
   CHROMA_DB_PATH=app/chroma_db
   KNOWLEDGE_BASE_PATH=../knowledge_base
   UPLOAD_PATH=app/uploads/pdf
   ```
5. Start the FastAPI server:
   ```bash
   # Windows:
   .venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
   # macOS/Linux:
   python -m uvicorn app.main:app --reload --port 8000
   ```
   The backend will be available at `http://localhost:8000`.

### 3. Run the Frontend Server
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

---

## 📡 API Endpoints Documentation

| Method | Endpoint | Description | Payload Schema |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Welcoming message root. | None |
| **GET** | `/health` | Server health diagnostic status. | None |
| **POST** | `/generate` | Generate startup feedback report based on an idea. | `{ "idea": "string (min_length=10)" }` |
| **GET** | `/knowledge` | Fetch lists of all system seed and user files. | None |
| **POST** | `/upload` | Upload and index `.md` files into vector store. | `Multipart-form UploadFile` |
| **DELETE** | `/knowledge` | Clear out index cache and custom files. | None |
