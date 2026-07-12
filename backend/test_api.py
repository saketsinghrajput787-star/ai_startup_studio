import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Create model
model = genai.GenerativeModel("gemini-2.5-flash")

# Test request
response = model.generate_content("Hello!")

print(response.text)