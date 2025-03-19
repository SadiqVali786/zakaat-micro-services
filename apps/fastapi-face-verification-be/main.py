from fastapi import FastAPI
import uvicorn
from dotenv import load_dotenv
import os

load_dotenv()
PORT = int(os.getenv("FASTAPI_FACE_VERIFICATION_BE_PORT"))
print(f"Using port: {PORT}")  # Debugging step

app = FastAPI()


@app.get("/")
async def index():
    return {"name": "Sadiq Vali", "message": "Hello World!"}


@app.get("/welcome")
async def welcome(name: str):
    return {"welcome msg": f"Welcome {name} to Sadiq Vali FastAPI server"}

if __name__ == "__main__":
    # TODO:
    uvicorn.run(app, host="127.0.0.1", port=PORT)
