from fastapi import FastAPI
import uvicorn

app = FastAPI()


@app.get("/")
async def index():
    return {"name": "Sadiq Vali", "message": "Hello World!"}


@app.get("/welcome")
async def welcome(name: str):
    return {"welcome msg": f"Welcome {name} to Sadiq Vali FastAPI server"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
