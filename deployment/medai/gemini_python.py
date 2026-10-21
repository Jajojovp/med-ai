import google.generativeai as genai
import os
from dotenv import load_dotenv
import sys

# Cargar variables de entorno
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY no está definida. Cópiala en .env (nunca en código).")
MODEL = "models/gemini-1.5-flash"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python gemini_python.py 'mensaje'", file=sys.stderr)
        sys.exit(1)
    prompt = sys.argv[1]
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(MODEL)
    response = model.generate_content(prompt)
    print(response.text)
