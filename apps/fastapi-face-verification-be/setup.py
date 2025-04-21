# imports from the packages
from typing import List
from setuptools import find_packages, setup  # type: ignore

# initialization of constants
HYPHEN_E_DOT = "-e ."
PROJECT_NAME = "fast-api-face-verification-be"
VERSION = "0.0.1"
AUTHOR = "Sadiq Vali"
AUTHOR_EMAIL = "rebirth4vali@gmail.com"
REQUIREMENTS_FILE_PATH = "requirements.txt"


def get_requirements(file_path: str) -> List[str]:
    """
    this funtions will return the list of required libraries
    """
    requirements = []
    with open(file_path) as file_obj:
        requirements = file_obj.readlines()
    requirements = [req.replace("\n", "") for req in requirements]
    if HYPHEN_E_DOT in requirements:
        requirements.remove(HYPHEN_E_DOT)
    return requirements


setup(
    name=PROJECT_NAME,
    version=VERSION,
    author=AUTHOR,
    author_email=AUTHOR_EMAIL,
    packages=find_packages(),
    install_requires=get_requirements(REQUIREMENTS_FILE_PATH),
)
