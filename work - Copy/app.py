from flask import Flask, redirect, render_template, request, jsonify, session,Response 
import mysql.connector
import json
import time

notifications = []
app = Flask(__name__)

# Configure MySQL connection
db = mysql.connector.connect(
    host="localhost",       
    user="Medan",           
    password="mySQL132465", 
    database="login_system"  
)

# Secret key for session management
app.secret_key = 'your_secret_key_here'

@app.route('/live_notifications')
def live_notifications():
    def event_stream():
        while True:
            if notifications:
                message = notifications.pop(0)  # Get the next notification
                yield f"data: {message}\n\n"  # Format for SSE
            time.sleep(1)  # Prevent overloading the server

    return Response(event_stream(), content_type='text/event-stream')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_checkbox_states', methods=['GET'])
def get_checkbox_states():
    class_uuid = request.args.get('class_uuid')
    if not class_uuid:
        return jsonify({"success": False, "message": "Missing class UUID"}), 400

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT checkbox_states FROM classes WHERE uuid = %s", (class_uuid,))
    class_data = cursor.fetchone()
    cursor.close()

    if not class_data:
        return jsonify({"success": False, "message": "Class not found"}), 404

    checkbox_states = json.loads(class_data['checkbox_states']) if class_data['checkbox_states'] else {}
    return jsonify({"success": True, "checkbox_states": checkbox_states})

@app.route('/join_class', methods=['POST'])
def join_class():
    data = request.get_json()
    class_uuid = data.get('class_uuid')

    if not class_uuid:
        return jsonify({"success": False, "message": "Missing class UUID"}), 400

    try:
        # Query the database to check the class and session state
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT session_active FROM classes WHERE uuid = %s", (class_uuid,))
        class_data = cursor.fetchone()
        cursor.close()

        if not class_data:
            return jsonify({"success": False, "message": "Class not found"}), 404

        if class_data['session_active'] == 1:
                session['class_uuid'] = class_uuid  # Store class_uuid in the session
                return jsonify({"success": True, "redirect": "/session", "class_uuid": class_uuid})# Optionally render session.html
        else:
            return jsonify({"success": False, "message": "Session is not active"}), 403
    except Exception as e:
        print(f"Error processing join request: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route('/toggle_session', methods=['POST'])
def toggle_session():
    data = request.get_json()
    class_uuid = data.get('class_uuid')

    if not class_uuid:
        return jsonify({"success": False, "message": "Missing class UUID"}), 400

    try:
        # Toggle the session_active value in the database
        cursor = db.cursor(dictionary=True)

        cursor.execute("""
            UPDATE classes 
            SET session_active = NOT session_active
            WHERE uuid = %s
        """, (class_uuid,))
        db.commit()

        # Get the new session_active value
        cursor.execute("SELECT session_active FROM classes WHERE uuid = %s", (class_uuid,))
        new_status = cursor.fetchone()['session_active']
        cursor.close()

        return jsonify({
            "success": True,
            "message": "Session state toggled successfully!",
            "new_session_active": new_status
        })
    except Exception as e:
        print("Error toggling session state:", str(e))
        return jsonify({"success": False, "message": "Failed to toggle session state"}), 500


@app.route('/get_checked_formulas', methods=['GET'])
def get_checked_formulas():
    class_uuid = request.args.get('class_uuid')
    if not class_uuid:
        return jsonify({"success": False, "message": "Missing class UUID"}), 400

    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT checkbox_states FROM classes WHERE uuid = %s", (class_uuid,))
        result = cursor.fetchone()
        cursor.close()

        if not result:
            return jsonify({"success": False, "message": "Class not found"}), 404

        # Parse JSON and filter checked formulas
        checkbox_states = json.loads(result['checkbox_states'])
        checked_formulas = {key: value for key, value in checkbox_states.items() if value}

        return jsonify({"success": True, "checked_formulas": checked_formulas})
    except Exception as e:
        print(f"Error fetching checked formulas: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500


@app.route('/update_checkbox_states', methods=['POST'])
def update_checkbox_states():
    data = request.get_json()  # Parse JSON data from the request
    class_uuid = data.get('class_uuid')
    checkbox_states = data.get('checkbox_states')

    if not class_uuid or checkbox_states is None:
        return jsonify({"success": False, "message": "Missing class UUID or checkbox states"}), 400

    try:
        cursor = db.cursor()
        # Update the checkbox_states column in the classes table
        cursor.execute("""
            UPDATE classes 
            SET checkbox_states = %s 
            WHERE uuid = %s
        """, (json.dumps(checkbox_states), class_uuid))
        db.commit()
        cursor.close()
        print("Class UUID:", class_uuid)
        print("Checkbox States to Save:", checkbox_states)


        return jsonify({"success": True, "message": "Checkbox states updated successfully!"})
    except Exception as e:
        print("Error updating checkbox states:", str(e))  # Debugging
        return jsonify({"success": False, "message": "Database update failed"}), 500



@app.route('/login', methods=['POST'])
def login():
    login_input = request.form.get('login')
    password_input = request.form.get('password')
    
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE login = %s", (login_input,))
    user = cursor.fetchone()
    cursor.close()
    
    if user is None:
        # User does not exist
        return jsonify({"success": False, "message": "User not found. Please register."}), 400
        
    else:
        if user['password'] != password_input:
            # Incorrect password
            return jsonify({"success": False, "message": "Incorrect password, please try again."}), 400
        else:
            # Successful login, store user ID in session
            session['user_id'] = user['id']
            session['user_login'] = login_input
            print(session.get('user_login'))
            return jsonify({"success": True, "message": "Login successful!"}), 200
        
@app.route('/delete_class', methods=['POST'])
def delete_class():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401

    data = request.get_json()
    class_id = data.get('id')  # Get class ID from the request

    if not class_id:
        return jsonify({'success': False, 'message': 'Class ID missing'}), 400

    cursor = db.cursor(dictionary=True)

    # Check if class exists
    cursor.execute("SELECT * FROM classes WHERE id = %s", (class_id,))
    class_info = cursor.fetchone()
    
    if not class_info:
        return jsonify({'success': False, 'message': 'Class not found'}), 404

    # Remove the class from the database
    cursor.execute("DELETE FROM classes WHERE id = %s", (class_id,))
    db.commit()

    # Remove the class ID from the user's class list
    user_id = session['user_id']
    cursor.execute("SELECT classes FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if user and user['classes']:
        user_classes = json.loads(user['classes'])
        if class_id in user_classes:
            user_classes.remove(class_id)
            cursor.execute("UPDATE users SET classes = %s WHERE id = %s", (json.dumps(user_classes), user_id))
            db.commit()

    cursor.close()
    return jsonify({'success': True, 'message': 'Class deleted successfully'})


@app.route('/create_class', methods=['POST'])
def create_class():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401
    
    data = request.get_json()
    class_name = data.get('class_name')

    if not class_name:
        return jsonify({"success": False, "message": "Class name is required"}), 400

    cursor = db.cursor(dictionary=True)

    # Add new class with the creator as the first member and initialize checkbox_states as {}
    creator_id = session['user_id']
    members_list = json.dumps([creator_id])  # Store as JSON
    initial_checkbox_states = json.dumps({})  # Initialize checkbox_states as an empty JSON object

    cursor.execute("""
        INSERT INTO classes (name, members, checkbox_states) 
        VALUES (%s, %s, %s)
    """, (class_name, members_list, initial_checkbox_states))
    db.commit()
    class_uuid = cursor.lastrowid  # Get the new class UUID

    # Retrieve current user's classes
    cursor.execute("SELECT classes FROM users WHERE id = %s", (creator_id,))
    user = cursor.fetchone()
    
    user_classes = json.loads(user['classes']) if user['classes'] else []
    user_classes.append(class_uuid)

    # Update user's classes in the database
    cursor.execute("UPDATE users SET classes = %s WHERE id = %s", (json.dumps(user_classes), creator_id))
    db.commit()

    cursor.close()
    return jsonify({"success": True, "message": "Class created successfully!", "class_uuid": class_uuid})


@app.route('/get_classes', methods=['GET'])
def get_classes():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Unauthorized"}), 401

    user_id = session['user_id']
    cursor = db.cursor(dictionary=True)

    # Get user's class IDs
    cursor.execute("SELECT classes FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if not user or not user['classes']:
        return jsonify({"success": True, "classes": []})  # No classes found

    user_classes = json.loads(user['classes'])  # Convert JSON string to list

    # Fetch class details including UUID
    user_class_data = []
    for class_id in user_classes:
        cursor.execute("SELECT id, name, uuid FROM classes WHERE id = %s", (class_id,))
        class_info = cursor.fetchone()
        if class_info:
            user_class_data.append({
                "id": class_info["id"],
                "name": class_info["name"],
                "uuid": class_info["uuid"]
            })

    cursor.close()
    return jsonify({"success": True, "classes": user_class_data})

@app.route('/register', methods=['POST'])
def register():
    login_input = request.form.get('login')
    password_input = request.form.get('password')

    if not login_input or not password_input:
        return jsonify({"success": False, "message": "Username and password cannot be empty"}), 400
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE login = %s", (login_input,))
    user = cursor.fetchone()
    if user:
        # User already exists
        cursor.close()
        return jsonify({"success": False, "message": "User already exists. Please choose a different login."}), 400
    else:
        # Insert the new user into the database with an empty list for classes
        empty_classes = json.dumps([])  # Convert the empty list to a JSON string
        cursor.execute("INSERT INTO users (login, password, classes) VALUES (%s, %s, %s)", 
                       (login_input, password_input, empty_classes))
        db.commit()
        cursor.close()
        return jsonify({"success": True, "message": "Registration successful! You can log in now."}), 200

@app.route('/home')
def home():
    # Ensure the user is logged in before accessing this page
    if 'user_id' not in session:
        return redirect('/')

    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT login FROM users WHERE id = %s", (session['user_id'],))
    user = cursor.fetchone()
    cursor.close()

    return render_template('home.html', username=user['login'])

@app.route('/fullscreen_exit', methods=['POST'])
def fullscreen_exit():
    data = request.get_json()  # Parse the JSON payload
    user_id_message = data.get('userID')
    class_uuid = data.get('classUUID')

    if user_id_message and class_uuid:
        # Log the event
        message = f"User {user_id_message} exited fullscreen mode in class {class_uuid}"
        print(message)

        # Add the message to the notifications list
        notifications.append(message)

        # Respond to the frontend
        return jsonify({"success": True, "message": "Fullscreen exit logged and message sent."}), 200
    else:
        return jsonify({"success": False, "message": "Missing userID or classUUID."}), 400

# @app.route('/fullscreen_exit', methods=['POST'])
# def fullscreen_exit():
#     data = request.get_json()  # Parse the JSON payload sent from the frontend
#     user_id_message = data.get('userID')  # Extract the 'userID' value
#     class_uuid = data.get('classUUID')    # Extract the 'classUUID' value

#     if user_id_message and class_uuid:
#         # Log the event
#         print(f"User {user_id_message} tried exiting class {class_uuid}")

#         try:
#             cursor = db.cursor(dictionary=True)

#             # Fetch the leader's login based on the leader's ID in the members JSON
#             query = """
#                 SELECT u.login AS leader_login
#                 FROM classes
#                 JOIN users u ON u.id = JSON_UNQUOTE(JSON_EXTRACT(classes.members, '$[0]'))
#                 WHERE classes.uuid = %s
#             """
#             cursor.execute(query, (class_uuid,))
#             result = cursor.fetchone()

#             if result and result['leader_login']:
#                 leader_login = result['leader_login']
#                 print(f"Notify leader {leader_login}: User {user_id_message} exited fullscreen mode in class {class_uuid}")

#                 # Respond with success
#                 return jsonify({"success": True, "message": f"Fullscreen exit logged and leader {leader_login} notified."}), 200
#             else:
#                 return jsonify({"success": False, "message": "Leader not found for the class."}), 404

#         except mysql.connector.Error as err:
#             print(f"Database error: {err}")
#             return jsonify({"success": False, "message": "Database error occurred."}), 500

    # else:
        # Respond with error if data is missing
        # return jsonify({"success": False, "message": "Missing userID or classUUID."}), 400




@app.route('/session')
def session_page():
    user_login = session.get('user_login')
    class_uuid = session.get('class_uuid')

    return render_template('session.html', user_id=user_login,class_uuid = class_uuid)

@app.route('/get_session_active', methods=['GET'])
def get_session_active():
    class_uuid = request.args.get('class_uuid')  # Get classUUID from query params

    if not class_uuid:
        return jsonify({"success": False, "message": "Missing class UUID"}), 400

    try:
        import mysql.connector
        db = mysql.connector.connect(
            host="localhost",
            user="Medan",
            password="mySQL132465",
            database="login_system"
        )
        cursor = db.cursor(dictionary=True)

        # Query to fetch the session_active value
        query = "SELECT session_active FROM classes WHERE uuid = %s"
        cursor.execute(query, (class_uuid,))
        result = cursor.fetchone()

        if result:
            return jsonify({"success": True, "session_active": result['session_active']}), 200
        else:
            return jsonify({"success": False, "message": "Class not found"}), 404

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return jsonify({"success": False, "message": "Database error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/logout')
def logout():
    session.pop('user_id', None)  # Remove user from session
    return redirect('/')