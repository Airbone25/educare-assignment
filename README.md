# School Management System API

A Node.js and Express built API specifically designed to manage a directory of schools and their geographical coordinates. It leverages MySQL for robust data storage and implements the Haversine formula to effortlessly sort schools retrieved from the database based on their proximity to a user's location.

## Features

- **Add School:** Validates and stores new school details into the database including address and precise coordinate points.
- **Find Nearby Schools:** Retrieves a list of all saved schools cleanly sorted by real-world distance from a user's provided GPS location.
- **Auto-Initialization:** The application automatically spins up the required MySQL database and table schema upon launch if they aren't detected.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Backend web framework used to set up API endpoints.
- **MySQL**: To communicate and perform statements on the MySQL Database using a connection pool.

---

## Setup & Installation

### 1. Prerequisites
- **Node.js** (v14+ recommended)
- **MySQL** instance running locally or via a cloud provider.

### 2. Clone and Install
Clone this repository and open the directory in your terminal. Install the necessary dependencies with:
```bash
npm install
```

### 3. Environment Variable Configuration
Create a `.env` file in the root directory. Configure your MySQL credentials to allow the application to connect to your database:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=school_management_db
```

### 4. Run the Application
Start the server in Development mode (uses `nodemon` to refresh on file changes):
```bash
npm run dev
```
Start the server in Production mode:
```bash
npm start
```
*Note: The server typically runs on Port `3000` (`http://localhost:3000`). Make sure your database server is active before starting up. The application will automatically create the defined `DB_NAME` database and the `schools` table on startup.*

---

## API Documentation

### 1. Add a School
**Endpoint:** `POST /addSchool`

Allows users to add a new school to the database.

**Request Body (JSON):**
```json
{
  "name": "Delhi Public School",
  "address": "Mathura Road, New Delhi, 110003",
  "latitude": 28.5355,
  "longitude": 77.2512
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "Delhi Public School",
    "address": "Mathura Road, New Delhi, 110003",
    "latitude": 28.5355,
    "longitude": 77.2512
  }
}
```

### 2. List Schools by Real-world Proximity
**Endpoint:** `GET /listSchools`

Fetches all schools in the system and sorts them dynamically based on their kilometer distance from coordinates supplied in the query string.

**Query Parameters:**
- `latitude` (Float): The latitude of the user's location.
- `longitude` (Float): The longitude of the user's location.

**Example Request:**
`GET http://localhost:3000/listSchools?latitude=10&longitude=50`

**Success Response:**
```json
{
  "success": true,
  "message": "Schools retrieved and sorted by proximity",
  "user_location": {
    "latitude": 10,
    "longitude": 50
  },
  "total": 1,
  "data": [
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi, 110003",
      "latitude": 28.5355,
      "longitude": 77.2512,
      "distance_km": 3509.23
    }
  ]
}
```

---

## Authors & License
This project was designed for demonstrating practical API building, mathematical calculation of geographic points, database connections, and standard HTTP implementations.

Standard ISC License.