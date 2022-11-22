import sqlite3
from flask import Flask, flash, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash

from helpers import apology, login_required

app = Flask(__name__)

app.config["TEMPLATES_AUTO_RELOAD"] = True

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


con = sqlite3.connect("RPGdatabase.db", check_same_thread=False)
db = con.cursor()

@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

user = 'usuário'


@app.route("/")
@login_required
def index():
    return adventure()

@app.route("/adventure")
@login_required
def adventure():
    return render_template("adventure.html", user = user)

@app.route("/config")
@login_required
def config():
    return render_template("config.html", user = user)

@app.route("/collection")
@login_required
def collection():
    return render_template("collection.html", user = user)

@app.route("/imageView")
@login_required
def imageView():
    return render_template("imageView.html", user = user)

@app.route("/login", methods=["GET", "POST"])
def login():
    global user
    session.clear()
    if request.method == "POST":

        if not request.form.get("username"):
            return apology("informar usuário", 403)

        elif not request.form.get("password"):
            return apology("informar senha", 403)

        db.execute("SELECT * FROM users WHERE username = ?", [request.form.get("username")])
        rows = db.fetchall()

        if len(rows) != 1 or not check_password_hash(rows[0][2], request.form.get("password")):
            return apology("login ou senha inválido", 403)

        session["user_id"] = rows[0][0]
        user = rows[0][1]
        return redirect("/")

    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":

        if not request.form.get("username"):
            return apology("informar usuário", 400)

        elif not request.form.get("password"):
            return apology("informar senha", 400)

        elif not request.form.get("confirmation"):
            return apology("informar senha novamente", 400)

        if request.form.get("password") != request.form.get("confirmation"):
            return apology("senhas devem ser iguais", 400)

        db.execute("SELECT * FROM users WHERE username = ?", [request.form.get("username")])
        user = db.fetchall()
        if user != []:
            return apology("Este usuário já existe, escolha outro nome de usuário", 400)
        db.execute("INSERT INTO users(username, hash) VALUES(?, ?)", (request.form.get(
            "username"), generate_password_hash(request.form.get("password"))))
        con.commit()
        return redirect("/")
    else:
        return render_template("register.html")

@app.errorhandler(500)
@login_required
def page_not_found(e):
    return apology("caminho inválido", 500)

@app.errorhandler(404)
@login_required
def page_not_found(e):
    return apology("caminho inválido", 404)
