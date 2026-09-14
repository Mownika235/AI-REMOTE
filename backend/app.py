git
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI
import os


# Load .env file

load_dotenv()


# Create FastAPI application

app = FastAPI()


# Allow frontend to communicate with backend

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# OpenAI API key

client = OpenAI(
    api_key=os.getenv(
        "OPENAI_API_KEY"
    )
)


# ==========================================
# REQUEST FORMAT
# ==========================================

class ChatRequest(BaseModel):

    message: str

    mode: str = "Friendly"


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():

    return {
        "message":
        "AI Remote Backend is Running 🚀"
    }


# ==========================================
# CHAT
# ==========================================

@app.post("/chat")
def chat(request: ChatRequest):


    # Different AI personalities

    instructions = {

        "Friendly":
            "You are a friendly and helpful AI assistant. Explain things simply.",

        "Study":
            "You are a study assistant. Teach step by step using easy examples.",

        "Coding":
            "You are a coding assistant. Explain programming concepts for beginners.",

        "Creative":
            "You are a creative AI assistant. Give innovative and interesting ideas."

    }


    system_prompt =instructions.get(
            request.mode,
            instructions["Friendly"]
        )


    try:

        response = client.responses.create(

            model=os.getenv(
                "OPENAI_MODEL",
                "gpt-5.6-luna"
            ),

            instructions=system_prompt,

            input=request.message

        )


        answer = response.output_text


        return {
            "reply": answer
        }


    except Exception as e:

        return {
            "reply":
            "Sorry! Something went wrong with the AI 😕"
        }

