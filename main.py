from flask import Flask, jsonify, request, json
import sqlite3
# from datetime import datetime
# from flask_cors import CORS
# from flask_bcrypt import Bcrypt
# from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

app = Flask(__name__)

# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = ''
# app.config['MYSQL_DB'] = 'nodejs_login1'
# app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
# app.config['JWT_SECRET_KEY'] = 'secret'
#
# mysql = MySQL(app)
# bcrypt = Bcrypt(app)
# jwt = JWTManager(app)

# CORS(app)

@app.route('/api/auth/register/', methods=['POST'])
def register():
    conn = sqlite3.connect('database.db')
    print "somthing"
    cur = conn.cursor()
    email = request.get_json()['username']
    password = request.get_json()['password']
    dob = request.get_json()['dob']
    avatar = request.get_json()['avatar']

    cur.execute("INSERT INTO users (email, password, dob, avatar) VALUES ('" +
		str(email) + "', '" +
		str(password) + "', '" +
		str(dob) + "', '" +
		str(avatar) + "')")
    conn.commit()
	
    result = {
		'email' : email,
		'password' : password,
		'dob' : dob,
		'avatar' : avatar
	  }
    conn.close()
    return jsonify({'result' : result})
	

@app.route('/api/auth/login/', methods=['POST'])
def login():
    conn = sqlite3.connect('database.db')

    cur = conn.cursor()
    email = request.get_json()['email']
    password = request.get_json()['password']
    result = ""
	
    cur.execute("SELECT * FROM users where email = '" + str(email) + "'")
    rv = cur.fetchone()
	
    if rv['password'] == password:
        access_token = create_access_token(identity = {'email': rv['email'],'password': rv['password']})
        result = access_token
    else:
        result = jsonify({"error":"Invalid username and password"})
    conn.close()

    return result
	
if __name__ == '__main__':
    app.run(debug=True)
