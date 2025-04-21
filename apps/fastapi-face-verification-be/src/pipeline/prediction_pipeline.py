from typing import Dict
import numpy as np
from fastapi import UploadFile
from src.utils import validate_image_file, process_image_file
from src.constants import *
from src.exception import CustomException
from src.logger import logging
from deepface import DeepFace


class FaceEncodingPipeline:
    """Pipeline for processing and encoding face images"""

    def __init__(self):
        self.model_name = MODEL_NAME
        self.detector_backend = DETECTOR_BACKEND
        self.normalization = NORMALIZATION
        self.align = ALIGN
        self.enforce_detection = ENFORCE_DETECTION

    def validate_input(self, file: UploadFile) -> None:
        """Validate input file"""
        try:
            if not validate_image_file(file):
                raise ValueError(
                    "Invalid file type. Please upload an image file.")
        except Exception as e:
            logging.error(f"Error validating input file: {str(e)}")
            raise CustomException(e)

    def process_image(self, file: UploadFile) -> np.ndarray:
        """Process input image file"""
        try:
            return process_image_file(file)
        except Exception as e:
            logging.error(f"Error processing image: {str(e)}")
            raise CustomException(e)

    def encode_face(self, image: np.ndarray) -> Dict[str, np.ndarray]:
        """Extract face encoding from image"""
        try:
            representation = DeepFace.represent(
                img_path=image,
                model_name=self.model_name,
                normalization=self.normalization,
                detector_backend=self.detector_backend,
                align=self.align,
                enforce_detection=self.enforce_detection
            )[0]

            return {
                "embedding": np.array(representation["embedding"], dtype="f")
            }
        except Exception as e:
            logging.error(f"Error encoding face: {str(e)}")
            raise CustomException(e)

    def run_pipeline(self, file: UploadFile) -> Dict[str, np.ndarray]:
        """Run the complete face encoding pipeline"""
        try:
            logging.info("Starting face encoding pipeline")

            # Step 1: Validate input
            logging.info("Validating input file")
            self.validate_input(file)

            # Step 2: Process image
            logging.info("Processing image file")
            processed_image = self.process_image(file)

            # Step 3: Encode face
            logging.info("Encoding face")
            result = self.encode_face(processed_image)

            logging.info("Face encoding pipeline completed successfully")
            return result

        except Exception as e:
            logging.error(f"Pipeline execution failed: {str(e)}")
            raise CustomException(e)
