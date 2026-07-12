from pathlib import Path

# Base directory of the app (backend/app)
BASE_DIR = Path(__file__).resolve().parent

# Project root (AI-Startup-Studio)
PROJECT_ROOT = BASE_DIR.parent.parent

# Paths and constants
KNOWLEDGE_BASE = PROJECT_ROOT / "knowledge_base"
UPLOAD_FOLDER = BASE_DIR / "uploads" / "pdf"
VECTOR_DB = BASE_DIR / "chroma_db"
