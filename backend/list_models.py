import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
models = [m.name for m in genai.list_models() if "generateContent" in m.supported_generation_methods]
with open("models.txt", "w") as f:
    f.write("\n".join(models))
