import pytest, sqlite3
from flask import session

import sys
import os

# Add the root directory of your Flask application to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app

@pytest.fixture()
def test_app():
    test_app = app
    test_app.config.update({
        "TESTING": True,
        "LOGIN_DISABLED": True,
    })
    
    yield test_app


@pytest.fixture()
def client(test_app):
    return test_app.test_client()
