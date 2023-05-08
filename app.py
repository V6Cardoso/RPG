#requisição das dependencias
import sqlite3, json
from flask import Flask, flash, jsonify, redirect, render_template, request, session
from flask_session import Session
from tempfile import mkdtemp
from werkzeug.security import check_password_hash, generate_password_hash
from flask_httpauth import HTTPBasicAuth

from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager

from os.path import exists

from helpers import apology, login_required
from nlp import analysis

app = Flask(__name__)

config = json.load(open("home/v6cardoso/config.json"))

auth = HTTPBasicAuth()

app.config["TEMPLATES_AUTO_RELOAD"] = True

app.config["SESSION_PERMANENT"] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.config["SESSION_TYPE"] = "filesystem"

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = config["jwtSecret"]
jwt = JWTManager(app)

Session(app)

#conexao com banco de dados
con = sqlite3.connect("example.db", check_same_thread=False)
db = con.cursor()

@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

#Busca imagens salvas por cada usuario
@app.route("/")
@login_required
def index():
    return adventure()

@app.route("/myImages")
@jwt_required()
def myImages():
    db.execute("SELECT images FROM users_images INNER JOIN users ON users.id = users_images.user_id WHERE users.username = ?", [get_jwt_identity()])
    data = db.fetchall()
    if data == []:
        return jsonify('Esse usuário não possui imagens no banco')
    images = {"data" : []}
    for image in data:
        images["data"].append({"link" : image[0]})
    return jsonify(images), 200

#basic auth authorization api
@auth.verify_password
def authenticate(username, password):
    if username and password:
        db.execute("SELECT * FROM users WHERE username = ?", [username])
        data = db.fetchone()
        if data == None:
            return False
        if check_password_hash(data[2], password):
            return True
        return False
    return False

@app.route("/generateToken", methods=["GET", "POST"])
@auth.login_required
def generateToken():
    access_token = create_access_token(identity=auth.username())
    return jsonify(access_token=access_token), 200



@app.route("/adventure", methods=["GET", "POST"])
@login_required
def adventure():
    if request.method == "POST":
        if request.form.get("id"):
            db.execute("UPDATE users_images SET images = ?, collection_name = ? WHERE id_container = ? AND user_id = ?", (request.form.get("images"), request.form.get("collectionName"), request.form.get("id"), session["user_id"]))
            con.commit()
        else:
            db.execute("INSERT INTO users_images(user_id, images, collection_name) VALUES(?, ?, ?)", (session["user_id"], request.form.get("images"), request.form.get("collectionName")))
            con.commit()
        return redirect('/collection')
    else:
        db.execute("SELECT apiKey, pseId, demoCounter FROM users_apikey WHERE user_id = ? ", [session["user_id"]])
        data = db.fetchone()
        if data == None:
            return redirect('/config')
        if data[0] == None or data[1] == None:
            if data[2] != None:
                if data[2] == 0:
                    return redirect('/config')
                db.execute("Update users_apikey SET demoCounter = ? WHERE user_id = ?", (data[2] - 1, session["user_id"]))
                con.commit()
                db.execute("SELECT apiKey, pseId FROM users_apikey WHERE id_key = ? ", [1])
                data = db.fetchone()
            else:
                return redirect('/config')
        images = None
        if request.args.get('id'):
            db.execute("SELECT images, collection_name FROM users_images WHERE id_container = ? AND user_id = ?", (request.args.get('id'), session["user_id"]))
            images = db.fetchone()
            if images == None:
                return apology("coleção não encontrada", 400)
        keys = {'apiKey': data[0], 'pseId': data[1], "text": request.form.get("text")}
        return render_template("adventure.html", user = session["user_name"], keys=keys, images = images)


@app.route('/analysis', methods=["POST"])
def analyse():
    return analysis(request.form.get("text"))

#Gerencia imagens do usuario
@app.route("/config", methods=["GET", "POST"])
@login_required
def config():
    if request.method == "POST":
        db.execute("SELECT * FROM users_apikey WHERE user_id = ?", [session["user_id"]])
        rows = db.fetchall()
        if rows != []:
            db.execute("Update users_apikey SET apiKey = ?, pseId = ? WHERE user_id = ?", (request.form.get("api-key"), request.form.get("pse-id"), session["user_id"]))
            con.commit()
        else:
            db.execute("INSERT INTO users_apikey(apiKey, pseId, user_id) VALUES(?, ?, ?)", (request.form.get("api-key"), request.form.get("pse-id"), session["user_id"]))
            con.commit()
        return redirect('/config')
    else:
        db.execute("SELECT apiKey, pseId FROM users_apikey WHERE user_id = ? ", [session["user_id"]])
        data = db.fetchone()
        keys = {'apiKey': data[0] if data != None else '', 'pseId': data[1] if data != None else ''}
        return render_template("config.html", user = session["user_name"], keys=keys)
    
@app.route("/demoMode", methods=["POST"])
@login_required
def demoMode():
    db.execute("SELECT * FROM users_apikey WHERE user_id = ?", [session["user_id"]])
    data = db.fetchone()
    if data == None:
        db.execute("INSERT INTO users_apikey(demoCounter, user_id) VALUES(?, ?)", (1000, session["user_id"]))
        con.commit()
        return redirect("/adventure")
    demoCounter = data[4]
    if demoCounter != None:
        if demoCounter == 0:
            return apology("Avaliação acabou :/", 406)
        else:
            return apology("Avaliação ativa, faça suas pesquisas", 200)
    db.execute("Update users_apikey SET demoCounter = ? WHERE user_id = ?", (1000, session["user_id"]))
    con.commit()
    return redirect("/adventure")



@app.route("/collection", methods=["GET", "POST"])
@login_required
def collection():
    if request.method == "POST":
        db.execute("DELETE FROM users_images WHERE user_id = ? AND id_container = ?", (session["user_id"], request.form.get("id")))
        con.commit()
    db.execute("SELECT * FROM users_images WHERE user_id = ?", [session["user_id"]])
    rows = db.fetchall()
    return render_template("collection.html", user = session["user_name"], images=rows)

#Controle de login
@app.route("/login", methods=["GET", "POST"])
def login():
    session.clear()
    if request.method == "POST":

        if not request.form.get("username"):
            return apology("informar usuário", 403)

        elif not request.form.get("password"):
            return apology("informar senha", 403)

        db.execute("SELECT * FROM users WHERE username = ?", [request.form.get("username")])
        rows = db.fetchone()

        if rows == None or not check_password_hash(rows[2], request.form.get("password")):
            return apology("login ou senha inválido", 403)

        session["user_id"] = rows[0]
        session["user_name"] = rows[1]
        return redirect("/")

    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

#Controle de cadastro
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
    

@app.route("/about")
def about():
    return render_template("about.html", user = session.get("user_name"))

#Controle de erros
@app.errorhandler(500)
@login_required
def page_not_found(e):
    return apology("caminho inválido", 500)

@app.errorhandler(404)
@login_required
def page_not_found(e):
    return apology("caminho inválido", 404)
