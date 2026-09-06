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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"https?://.*",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Register routers under both root and /api prefix for local and production deployment (e.g. AWS ALB, Nginx, CloudFront)
routers = [generate_router, upload_router, health_router, rag_router, admin_router]
for router in routers:
    app.include_router(router)
    app.include_router(router, prefix="/api")


@app.get("/")
@app.get("/api")
@app.get("/api/")
def root():
    return {
        "message": "Welcome to FoundrAI 🚀"
    }