from flask import session

def test_access_session(client):
    with client.session_transaction() as session:
        session["user_id"] = 1
        session["user_name"] = 'test_user'


def test_redirect(client):
    with client:
        response = client.get("/")
        # "/" redirects either to login or adventure
        assert response.status_code == 302

def test_access(client):
    with client:
        response = client.get("/login")
        assert response.status_code == 200