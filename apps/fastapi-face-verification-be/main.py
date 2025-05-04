from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.pipeline.prediction_pipeline import FaceEncodingPipeline
from src.exception import CustomException
from dotenv import load_dotenv
import os
import tensorflow as tf
from src.logger import logging
import uvicorn


def print_environment_variables():
    """
    Print all environment variables in a formatted way
    """
    logging.info("\nEnvironment Variables:")
    logging.info("=====================")
    for key, value in os.environ.items():
        logging.info(f"{key}: {value}")
    logging.info("=====================\n")


# Configure TensorFlow to be less verbose and only use CPU
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress TF logging
tf.config.set_visible_devices([], 'GPU')  # Disable GPU

load_dotenv()
PORT = int(os.getenv("FASTAPI_FACE_VERIFICATION_BE_PORT_MINE", "8000"))
ENV = os.getenv("ENV", "development")

HOST = "127.0.0.1" if ENV == "development" else "0.0.0.0"

app = FastAPI(
    title="Face Encoding API",
    description="API for encoding faces using DeepFace",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = FaceEncodingPipeline()


@app.get("/", summary="Health check endpoint", response_description="Returns a simple health check message")
async def health_check():
    """
    Health check endpoint to ensure the API is running.

    Returns:
    - A simple health check message
    """
    logging.info("Health check endpoint called")
    return {
        "status": "ok",
        "message": "API is running"
    }


@app.post("/encode_face", summary="Encode face from image", response_description="Returns face embedding")
async def encode_face(file: UploadFile):
    """
    Endpoint to encode a face from an uploaded image.

    Parameters:
    - file: Image file containing a face

    Returns:
    - Face embedding as a numpy array
    """
    logging.info("Encode face endpoint called")
    try:
        result = pipeline.run_pipeline(file)
        logging.info("Encode face endpoint completed")
        logging.info(f"Embedding: {result['embedding'].tolist()}")

        return {
            "status": "success",
            # Convert numpy array to list for JSON serialization
            "embedding": result["embedding"].tolist()
        }
    except CustomException as e:
        logging.error(f"Error in encode face endpoint: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logging.error(f"An unexpected error occurred: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )

# Print environment variables during startup
logging.info(f"Server started successfully @ http://localhost:{PORT}")
print_environment_variables()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)
