from flask import Flask, jsonify, request, json
import sqlite3
from datetime import datetime
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
import os
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)

from flask_socketio import SocketIO

from werkzeug.utils import secure_filename

import logging

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger('HELLO WORLD')

UPLOAD_FOLDER = './public/assets/'


app = Flask(__name__)

# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = ''
# app.config['MYSQL_DB'] = 'nodejs_login1'
# app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['JWT_SECRET_KEY'] = 'secret'
#
# mysql = MySQL(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
socketio = SocketIO(app)
CORS(app)
#Uncomment when have db
@app.route('/api/auth/register/', methods=['POST'])
def register():
    id = ''
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    email = request.get_json()['username']
    password = request.get_json()['password']
    dob = request.get_json()['dob']
    cur.execute("SELECT * FROM user where email = '" + str(email) + "'")
    rv = cur.fetchone()
    if not rv:
        cur.execute("INSERT INTO user (email, password, dob, avatar) VALUES ('" +
            str(email) + "', '" +
            str(password) + "', '" +
            str(dob) + "', '" +
            "" + "')")
        conn.commit()
        cur.execute("SELECT * FROM user where email = '" + str(email) + "'")
        rv = cur.fetchone()
        id = rv[0]
    else:
          id = rv[0]
          email = rv[1]
          password = rv[2]
          dob = rv[3]
    # result = {
	# 	'email' : email,
	# 	'password' : password,
	# 	'dob' : dob,
	# 	'avatar' : avatar
	#   }
    # conn.close()
    access_token = create_access_token(identity = {'email': email})
    result = {
        'id': id,
        'email' : email,
        'password' : password,
        'dob' : dob,
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
        access_token = create_access_token(identity = {'email': rv[1]})
        id = rv[0]
        email = rv[1]
        password = rv[2]
        dob = rv[3]
        result = {
            'id': id,
            'email' : email,
            'password' : password,
            'dob' : dob,
            'access_token': access_token,
        }
        jsonify({'result' : result})
        status = 201
    else:
        result = jsonify({"error":"Invalid username and password"})
        status = 403
    conn.close()

    return jsonify({'result' : result}), status


@app.route('/api/auth/user/', methods=['POST'])
def user_auth():
    return None


@app.route('/api/save-images/', methods=['POST'])
def file_uploads():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    target=os.path.join(UPLOAD_FOLDER)
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file'] 
    filename = secure_filename(request.form["filename"])
    userId = secure_filename(request.form["userId"])
    destination="/".join([target, filename])
    file.save(destination)
    cur.execute("UPDATE user SET avatar = '" + str(filename) + "' WHERE id = '" + str(userId) + "'")
    conn.commit()
    result = {
      'userId': userId,
      'avatar': filename
    }
    conn.close()
    return jsonify({'result': result}), 200


@app.route('/api/get-images/', methods=['POST'])
def get_avatar():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    userId = request.get_json()['userId']
    cur.execute("Select avatar from user WHERE id = '" + str(userId) + "'")
    rv = cur.fetchone()
    result = {
      'avatar': rv[0]
    }
    conn.close()
    return jsonify({'result': result}), 200


@app.route('/api/add-blogs/', methods=['POST'])
def addBlogs():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    userid = request.get_json()['userId']
    title = request.get_json()['title']
    content = request.get_json()['content']
    cur.execute("INSERT INTO blog (userId, title, content, createdDate) VALUES ('" +
                str(userid) + "', '" +
                str(title) + "', '" +
                str(content) + "', '" +
                str(datetime.now()) + "')")
    conn.commit()
    result = {
            'userid': id,
            'title' : title,
            'content' : content,
        }
    conn.close()
    return jsonify({'result' : {result}}),201

@app.route('/api/blogs/', methods=['POST'])
def get_blogs_user_by_id():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    userid = request.get_json()['userId']
    cur.execute("SELECT * FROM blog where userId = '" + str(userid) + "'")
    rv = cur.fetchall()
    blogs = []
    for row in rv:
        blog = {
            'title' : row[2],
            'content' : row[3],
            'createdDate': row[4]
        }
        blogs.append(blog)
    
    conn.close()
    return jsonify({'result' : blogs}),200

@app.route('/api/users/', methods=['POST'])
def get_all_users():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    userid = request.get_json()['userId']
    cur.execute("SELECT * FROM user ")
    rv = cur.fetchall()
    users = []
    for row in rv:
        cur.execute("SELECT * FROM relationship where (userId1 = '" + str(userid) + "' and userId2 = '" + str(row[0]) + "') or (userId1 = '" + str(row[0]) + "' and userId2 = '" + str(userid) + "')")
        instance = cur.fetchone()
        is_friend = "FRIEND" if instance else "GUEST"
        user = {
            'id': row[0],
            'email' : row[1],
            'dob' : row[3],
            'relation': is_friend
        }
        users.append(user)
    # result = jsonify({'data': users})
    conn.close()
    return jsonify({'result' : users}),200

# @app.route('/api/other-users/', methods=['POST'])
# def get_user_by_id():
#     conn = sqlite3.connect('database.db')
#     cur = conn.cursor()
#     userid = request.get_json()['userId']
#     cur.execute("SELECT * FROM user where id = '" + str(userid) + "'")
#     rv = cur.fetchone()
#     result = {
#             'id': rv[0],
#             'email' : rv[1],
#             'dob' : rv[3],
#     }
#     conn.close()
    return jsonify({'result' : result}),201

@app.route('/api/other-users/', methods=['POST'])
def get_user_by_username():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    userid = request.get_json()['userId']
    username = request.get_json()['username']
    cur.execute("SELECT * FROM user where email LIKE '%" + str(username) + "%'")
    rv = cur.fetchall()
    users = []
    if rv:
      for row in rv:
        cur.execute("SELECT * FROM relationship where (userId1 = '" + str(userid) + "' and userId2 = '" + str(
          row[0]) + "') or (userId1 = '" + str(row[0]) + "' and userId2 = '" + str(userid) + "')")
        instance = cur.fetchone()
        is_friend = "FRIEND" if instance else "GUEST"
        user = {
          'id': row[0],
          'email': row[1],
          'dob': row[3],
          'relation': is_friend
        }
        users.append(user)
    conn.close()
    return jsonify({'result' : users}),201

@app.route('/api/add-friends/', methods=['POST'])
def add_friends():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    result = ""
    userid = request.get_json()['userId']
    friend_id = request.get_json()['friendId']
    cur.execute("SELECT * FROM relationship where (userId1 = '" + str(userid) + "' and userId2 = '" + str(friend_id) + "') or (userId1 = '" + str(friend_id) + "' and userId2 = '" + str(userid) + "')")
    rv = cur.fetchone()
    if not rv:
      cur.execute("INSERT INTO relationship (userId1, userId2) VALUES ('" +
                  str(userid) + "', '" +
                  str(friend_id) + "')")
      conn.commit()
    result = {
      'userId': userid,
      'friend_id': friend_id
    }

    conn.close()
    return jsonify({'result': result}),201

@app.route('/api/find-friends/', methods=['POST'])
def find_friends():
  conn = sqlite3.connect('database.db')
  cur = conn.cursor()
  result = []
  search_string = request.get_json()['searchString']
  userid = request.get_json()['userId']
  cur.execute("SELECT * FROM user where email LIKE '%" + search_string +"%'" )
  rv = cur.fetchall()
  for row in rv:
    cur.execute("SELECT * FROM relationship where (userId1 = '" + str(userid) + "' and userId2 = '" + str(row[0]) + "') or (userId1 = '" + str(row[0]) + "' and userId2 = '" + str(userid) + "')")
    instance = cur.fetchone()
    is_friend = "FRIEND" if instance else "GUEST"
    result.append({
            'id': row[0],
            'email' : row[1],
            'dob' : row[3],
            'relation': is_friend
    })
  conn.close()
  return jsonify({'result': result}), 201


@app.route('/api/chat/sendMessages', methods=['POST'])
def send_message():
    conn = sqlite3.connect('database.db', isolation_level=None)
    cur = conn.cursor()
    print(request.get_json())
    fromUserId = request.get_json()['fromUserId']
    toUserId = request.get_json()['toUserId']
    content = request.get_json()['content']
    conn = sqlite3.connect('database.db')
    cur.execute("INSERT INTO conversation (fromUserId, toUserId, content, createdTime) VALUES ('" +
                str(fromUserId) + "', '" +
                str(toUserId) + "', '" +
                str(content) + "', '" +
                str(datetime.now()) + "')")
    conn.commit()
    result = {
            'fromUserId': fromUserId,
            'toUserId' : toUserId,
            'content' : content,
        }
    conn.close()

    return jsonify({}), 201


@app.route('/api/chat/loadMessages', methods=['POST'])
def load_message():
    conn = sqlite3.connect('database.db')
    cur = conn.cursor()
    fromUserId = request.get_json()['fromUserId']
    toUserId = request.get_json()['toUserId']
    cur.execute("SELECT * FROM conversation where (fromUserId = " + str(fromUserId) + " and toUserId = " + str(toUserId) +
    ") or (fromUserId = " + str(toUserId) + " and toUserId = " + str(fromUserId) + ") ORDER BY createdTime ASC")
    rv = cur.fetchall()

    result = []
    for mess in rv:
        result.append({
            'fromUserId': mess[1],
            'toUserId': mess[2],
            'content': mess[3],
        })

    conn.close()
    return jsonify({'result': result}), 200


if __name__ == '__main__':
    app.run(debug=True)
    socketio.run(app, debug=True)

