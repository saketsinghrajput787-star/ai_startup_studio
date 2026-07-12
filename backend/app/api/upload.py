import shutil
from pathlib import Path

from fastapi import APIRouter, File, UploadFile, HTTPException
from langchain_community.document_loaders import TextLoader
from langchain_chroma import Chroma

from app.config import UPLOAD_FOLDER, VECTOR_DB
from app.rag.embeddings import get_embeddings
from app.rag.splitter import split_documents

router = APIRouter(
    prefix="/upload",
    tags=["Knowledge Base"]
)


@router.post("/")
async def upload_document(file: UploadFile = File(...)):

    try:

        if not file.filename.endswith(".md"):

            raise HTTPException(
                status_code=400,
                detail="Only markdown files are allowed."
            )

        # Ensure upload folder exists
        UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

        save_path = UPLOAD_FOLDER / file.filename

        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Ingest the file into Chroma DB
        try:
            loader = TextLoader(str(save_path), encoding="utf-8")
            docs = loader.load()
            chunks = split_documents(docs)

            vector_store = Chroma(
                persist_directory=str(VECTOR_DB),
                embedding_function=get_embeddings()
            )
            vector_store.add_documents(chunks)
        except Exception as ingest_error:
            # Cleanup file if indexing fails
            if save_path.exists():
                save_path.unlink()
            raise HTTPException(
                status_code=500,
                detail=f"Failed to index uploaded file: {str(ingest_error)}"
            )

        return {
            "message": "File uploaded and indexed successfully.",
            "filename": file.filename
        }

    except HTTPException as he:
        raise he
    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )