from unittest.mock import patch, MagicMock


def test_upload_invalid_file(client):
    # Test uploading a non-markdown file
    response = client.post(
        "/upload/",
        files={"file": ("test.txt", b"Hello", "text/plain")}
    )

    assert response.status_code == 400

    assert "Only markdown files are allowed." in response.json()["detail"]


@patch("app.api.upload.TextLoader")
@patch("app.api.upload.split_documents")
@patch("app.api.upload.Chroma")
def test_upload_valid_file(mock_chroma, mock_split, mock_loader, client):
    # Mock Chroma, Splitter, and Loader
    mock_loader_instance = MagicMock()

    mock_loader_instance.load.return_value = []

    mock_loader.return_value = mock_loader_instance

    mock_split.return_value = []

    mock_chroma_instance = MagicMock()

    mock_chroma.return_value = mock_chroma_instance

    response = client.post(
        "/upload/",
        files={"file": ("test.md", b"# Startup Idea", "text/markdown")}
    )

    assert response.status_code == 200

    assert response.json()["message"] == "File uploaded and indexed successfully."

    assert response.json()["filename"] == "test.md"


def test_get_knowledge(client):
    response = client.get("/knowledge/")

    assert response.status_code == 200

    assert isinstance(response.json(), list)


@patch("app.api.rag.shutil.rmtree")
@patch("app.api.rag.os.listdir")
def test_delete_knowledge(mock_listdir, mock_rmtree, client):
    mock_listdir.return_value = []

    response = client.delete("/knowledge/")

    assert response.status_code == 200

    assert response.json()["message"] == "Knowledge base cleared successfully."
