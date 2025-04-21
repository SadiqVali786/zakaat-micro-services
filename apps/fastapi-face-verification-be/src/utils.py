import numpy as np
from typing import Dict, Union
from fastapi import UploadFile
import io
from PIL import Image
from deepface import DeepFace
from src.constants import *


def validate_image_file(file: UploadFile) -> bool:
    """Validate if uploaded file is an image"""
    return file.content_type.split('/')[0] == 'image'


def process_image_file(file: UploadFile) -> np.ndarray:
    """Process uploaded file into numpy array"""
    try:
        # Read file content
        contents = file.file.read()
        # Convert to PIL Image
        image = Image.open(io.BytesIO(contents))
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        return np.array(image)
    finally:
        file.file.close()


def encode_face_image(image: np.ndarray) -> Dict[str, Union[list, Dict[str, int]]]:
    """Extract face encoding and coordinates from image"""
    try:
        representation = DeepFace.represent(
            img_path=image,
            model_name=MODEL_NAME,
            normalization=NORMALIZATION,
            detector_backend=DETECTOR_BACKEND,
            align=ALIGN,
            enforce_detection=ENFORCE_DETECTION)[0]
        return {
            "embedding": np.array(representation["embedding"], dtype="f"),
        }
    except Exception as e:
        raise ValueError(f"Failed to encode face: {str(e)}")
