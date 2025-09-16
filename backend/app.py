import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from dotenv import load_dotenv

# Load HF token
load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

# Initialize OpenAI client pointing to Hugging Face
client = OpenAI(
    base_url="https://router.huggingface.co/v1",
    api_key=HF_TOKEN,
)

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    prompt = data.get("message", "")

    try:
        completion = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3-70B-Instruct:together",
            messages=[{"role": "user", "content": prompt}],
        )
        # Get the bot's reply
        reply = completion.choices[0].message.content
    except Exception as e:
        reply = f"Error connecting to Hugging Face API: {str(e)}"

    return {"reply": reply}
