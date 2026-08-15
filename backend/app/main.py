from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.generate import router as generate_router
from app.api.upload import router as upload_router
from app.api.health import router as health_router
from app.api.rag import router as rag_router
from app.api.admin import router as admin_router

app = FastAPI(
    title="FoundrAI",
    description="AI Startup Studio powered by Gemini + RAG",
    version="1.0.0",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual frontend origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_router)
app.include_router(upload_router)
app.include_router(health_router)
app.include_router(rag_router)
app.include_router(admin_router)



@app.get("/")
def root():
    return {
        "message": "Welcome to FoundrAI 🚀"
    }