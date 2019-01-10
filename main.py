from flask import Flask, jsonify, request, json
import sqlite3
# from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

app = Flask(__name__)

# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = ''
# app.config['MYSQL_DB'] = 'nodejs_login1'
# app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['JWT_SECRET_KEY'] = 'secret'
#
# mysql = MySQL(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

CORS(app)
#Uncomment when have db
@app.route('/api/auth/register/', methods=['POST'])
def register():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    email = request.get_json()['username']
    password = request.get_json()['password']
    dob = request.get_json()['dob']

    cur.execute("INSERT INTO user (email, password, dob, avatar) VALUES ('" +
		str(email) + "', '" +
		str(password) + "', '" +
		str(dob) + "', '" +
		# str(avatar) + "')")
    "" + "')")
    conn.commit()
	
    # result = {
	# 	'email' : email,
	# 	'password' : password,
	# 	'dob' : dob,
	# 	'avatar' : avatar
	#   }
    # conn.close()
    access_token = create_access_token(identity = {'email': email}).decode('ascii')
    result = {
	'email' : email,
	'password' : password,
	'dob' : dob,
    'access_token': access_token
  }
    return jsonify({'result' : result}), 201
	
@app.route('/api/auth/login/', methods=['POST'])
def login():
    conn = sqlite3.connect('database.db')
    status =""
    cur = conn.cursor()
    email = request.get_json()['username']
    password = request.get_json()['password']
    result = ""
    cur.execute("SELECT * FROM user where email = '" + str(email) + "'")
    rv = cur.fetchone()
    if rv[2] == password:
        print "hello"
        access_token = create_access_token(identity = {'email': rv[1]})
        result = access_token
        status = 201
    else:
        result = jsonify({"error":"Invalid username and password"})
        status = 403
    conn.close()

    return result, status

@app.route('/api/auth/user/', methods=['POST'])
def user_auth():
    print request.get_json()
    return null

@app.route('/api/blogs/', methods=['POST'])
def addBlogs():
    return {},201
if __name__ == '__main__':
    app.run(debug=True)
