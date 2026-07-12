import os
import shutil
from pathlib import Path
from fastapi import APIRouter, HTTPException
from langchain_chroma import Chroma

from app.config import VECTOR_DB, KNOWLEDGE_BASE, UPLOAD_FOLDER
from app.rag.embeddings import get_embeddings

router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge Base"]
)


@router.get("/")
def get_knowledge_documents():
    """
    List all documents in the knowledge base (both seed documents and uploaded files).
    """

    try:

        docs = []

        # Predefined system docs
        if KNOWLEDGE_BASE.exists():

            for root, _, files in os.walk(KNOWLEDGE_BASE):

                for file in files:

                    if file.endswith(".md"):

                        rel_path = os.path.relpath(
                            os.path.join(root, file),
                            KNOWLEDGE_BASE
                        )

                        # Skip files that might start with . or other hidden files
                        if file.startswith("."):

                            continue

                        docs.append({
                            "name": file,
                            "source": "system",
                            "path": rel_path
                        })

        # User uploaded docs
        if UPLOAD_FOLDER.exists():

            for file in os.listdir(UPLOAD_FOLDER):

                if file.endswith(".md"):

                    docs.append({
                        "name": file,
                        "source": "user",
                        "path": file
                    })

        return docs

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.delete("/")
def clear_knowledge_base():
    """
    Clear ChromaDB vector database and delete all uploaded documents.
    """

    try:

        # Clear vector database
        if VECTOR_DB.exists():

            # Fallback delete folder to ensure full reset
            shutil.rmtree(VECTOR_DB)

        # Re-initialize path
        VECTOR_DB.mkdir(parents=True, exist_ok=True)

        # Delete user-uploaded documents
        if UPLOAD_FOLDER.exists():

            for file in os.listdir(UPLOAD_FOLDER):

                file_path = UPLOAD_FOLDER / file

                if os.path.isfile(file_path):

                    os.remove(file_path)

        return {
            "message": "Knowledge base cleared successfully."
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
