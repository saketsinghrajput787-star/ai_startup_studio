from dotenv import load_dotenv
import os

from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

response = embeddings.embed_query("Hello World")

print(response[:10])
print(len(response))