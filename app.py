from flask import Flask, request, jsonify
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask app
app = Flask(__name__)

# Database configuration
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "sanket1234",
    "database": "emergenease"
}

# Connect to the database
db = mysql.connector.connect(**db_config)
cursor = db.cursor(dictionary=True)

# Signup route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.form

    # Common fields
    email = data.get('email')
    password = data.get('password')
    user_type = data.get('user_type')

    if not email or not password or not user_type:
        return jsonify({"error": "Missing required fields"}), 400

    # Hash the password
    hashed_password = generate_password_hash(password)

    try:
        # Insert into Users table
        cursor.execute("""
            INSERT INTO Users (email, password_hash, user_type)
            VALUES (%s, %s, %s)
        """, (email, hashed_password, user_type))
        user_id = cursor.lastrowid

        # Add user-specific details
        if user_type == 'Doctor':
            cursor.execute("""
                INSERT INTO Doctors (user_id, name, specialty, license_number, address, latitude, longitude)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                user_id, data['name'], data['specialty'], data['license_number'],
                data['address'], data.get('latitude', None), data.get('longitude', None)
            ))
        elif user_type == 'Patient':
            cursor.execute("""
                INSERT INTO Patients (user_id, name, age, gender)
                VALUES (%s, %s, %s, %s)
            """, (
                user_id, data['name'], data['age'], data['gender']
            ))
        elif user_type == 'Hospital':
            cursor.execute("""
                INSERT INTO Hospitals (user_id, name, license_number, address, latitude, longitude)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                user_id, data['name'], data['license_number'], data['address'],
                data.get('latitude', None), data.get('longitude', None)
            ))
        else:
            return jsonify({"error": "Invalid user type"}), 400

        db.commit()
        return jsonify({"message": "Signup successful!"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

# Login route
@app.route('/login', methods=['POST'])
def login():
    data = request.form
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user and check_password_hash(user['password_hash'], password):
        return jsonify({"message": "Login successful!", "user_type": user['user_type']}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Appointment booking route
@app.route('/appointment', methods=['POST'])
def book_appointment():
    data = request.form
    doctor_id = data.get('doctor_id')
    patient_id = data.get('patient_id')
    appointment_date = data.get('appointment_date')
    appointment_time = data.get('appointment_time')

    if not doctor_id or not patient_id or not appointment_date or not appointment_time:
        return jsonify({"error": "Missing appointment details"}), 400

    try:
        cursor.execute("""
            INSERT INTO Appointments (doctor_id, patient_id, appointment_date, appointment_time)
            VALUES (%s, %s, %s, %s)
        """, (doctor_id, patient_id, appointment_date, appointment_time))
        db.commit()
        return jsonify({"message": "Appointment booked successfully!"}), 201
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
