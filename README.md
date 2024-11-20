
# FlytBase Backend Assignment

This project is a backend service for managing users, drones, missions, and flight logs using TypeScript and MongoDB. The backend provides APIs to create and manage drones, missions, simulate mission executions, and store flight logs. This project is intended to manage drone operations, missions, and flight logs for a corporation's drone fleet.

## Features

- **APIS Validation** using Zod.
- **User Authentication** using JWT.
- **CRUD operations** for drones and missions.
- **Mission Execution Simulation** to simulate the drone's movement along the mission waypoints.
- **Flight Log** generation and storage.
- **API for Assigning and Removing Missions from Drones.**
- **Postman collection** for testing APIs.
- **PDF generation** for flight logs.

## Tech Stack

- **Node.js** - JavaScript runtime used to build the backend.
- **TypeScript** - Superset of JavaScript that adds type safety.
- **Express.js** - Web framework to build the REST API.
- **MongoDB** - NoSQL database for storing users, drones, missions, and flight logs.
- **Mongoose** - ODM (Object Data Modeling) library to interact with MongoDB.
- **JWT** - JSON Web Tokens for authentication and authorization.
- **Zod** - Schema validation library for validating and parsing request data.
- **pdfkit** - Library for generating PDF files for flight logs (bonus).
- **pnpm** - Package manager to handle dependencies.
- **dotenv** - Module for managing environment variables securely.
- **nodemon** - Tool for automatically restarting the server during development.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (for local development)
- [pnpm](https://pnpm.io/) (preferred for this project)

## Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/Sk-Owais/flytbase_assignment
   cd flytbase_assignment
   ```

2. Install the dependencies using pnpm:

   ```bash
   pnpm install
   ```

3. Create a `.env` file in the root of the project (if not already present) and add the following environment variables:

   ```dotenv
   PORT=1001
   MICROSERVICE_API_PATH=/flytbase
   APP_HOST_WITHOUT_PROTOCOL=localhost:1001
   MONGODB_URI=mongodb://0.0.0.0:27017/flytbase_assignment
   JWT_ISSUER=flytbase
   JWT_AUDIENCE=Authentication Service
   JWT_ALGORITHM=RS256
   ```

4. Start the server in **development mode**:

   ```bash
   pnpm run dev
   ```

   This will start the server using `nodemon` and automatically restart it upon changes.

## API Endpoints

### 1. User Authentication

#### **Login**:
- **POST** `/login`
- **Request Body**:
  ```json
  {
    "username": "user123",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "<JWT_TOKEN>"
  }
  ```

### 2. Drone Management

#### **Create Drone**:
- **POST** `/drones`
- **Request Body**:
  ```json
  {
    "drone_type": "Real Drone",
    "make_name": "cloudsim",
    "name": "Virtual Drone"
  }
  ```
- **Response**:
  ```json
  {
    "drone_id": "507f1f77bcf86cd799439011",
    "created_at": "2023-01-24T11:19:23.181Z",
    "updated_at": "2023-01-24T11:21:57.992Z"
  }
  ```

#### **Update Drone**:
- **PUT** `/drones/{drone_id}`
- **Request Body**:
  ```json
  {
    "drone_type": "Real Drone",
    "make_name": "cloudsim",
    "name": "Updated Drone Name"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Drone updated successfully"
  }
  ```

#### **Delete Drone**:
- **DELETE** `/drones/{drone_id}`
- **Response**:
  ```json
  {
    "message": "Drone deleted successfully"
  }
  ```

### 3. Mission Management

#### **Create Mission**:
- **POST** `/missions`
- **Request Body**:
  ```json
  {
    "alt": 40,
    "speed": 15,
    "name": "mission_1",
    "waypoints": [
      { "alt": 40, "lat": 37.42987269786578, "lng": -122.08320293735657 },
      { "alt": 40, "lat": 37.42987269786578, "lng": -122.08320293735657 }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "mission_id": "607f1f77bcf86cd799439011",
    "created_at": "2023-06-02T15:34:06.672Z",
    "updated_at": "2023-06-02T15:34:06.672Z"
  }
  ```

#### **Update Mission**:
- **PUT** `/missions/{mission_id}`
- **Request Body**:
  ```json
  {
    "alt": 50,
    "speed": 20,
    "name": "updated_mission",
    "waypoints": [
      { "alt": 50, "lat": 37.42987269786578, "lng": -122.08320293735657 },
      { "alt": 50, "lat": 37.42987269786578, "lng": -122.08320293735657 }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "message": "Mission updated successfully"
  }
  ```

#### **Delete Mission**:
- **DELETE** `/missions/{mission_id}`
- **Response**:
  ```json
  {
    "message": "Mission deleted successfully"
  }
  ```

### 4. Mission Assignment to Drone

#### **Assign Mission to Drone**:
- **POST** `/drones/{drone_id}/missions/{mission_id}`
- **Response**:
  ```json
  {
    "message": "Mission assigned successfully"
  }
  ```

#### **Remove Mission from Drone**:
- **DELETE** `/drones/{drone_id}/missions/{mission_id}`
- **Response**:
  ```json
  {
    "message": "Mission removed from drone successfully"
  }
  ```

### 5. Mission Execution Simulation

#### **Start Mission**:
- **POST** `/missions/{mission_id}/start`
- **Response**:
  ```json
  {
    "message": "Mission started successfully"
  }
  ```

#### **Stop Mission**:
- **POST** `/missions/{mission_id}/stop`
- **Response**:
  ```json
  {
    "message": "Mission stopped successfully"
  }
  ```

#### **Fetch Flight Log by Flight ID**:
- **GET** `/flights/{flight_id}`
- **Response**:
  ```json
  {
    "flight_id": "1231f77bcf86cd799439999",
    "mission_name": "mission_1",
    "waypoints": [
      { "time": 0, "alt": 40, "lat": 37.42987269786578, "lng": -122.08320293735657 },
      { "time": 1, "alt": 40, "lat": 37.42987269786578, "lng": -122.08320293735657 }
    ],
    "speed": 15,
    "distance": 350,
    "execution_start": "2024-06-15T10:00:00Z",
    "execution_end": "2024-06-15T10:15:00Z"
  }
  ```

### 6. PDF Generation for Flight Log

#### **Generate PDF for Flight Log**:
- **GET** `/flights/{flight_id}/pdf`
- **Response**:
  - PDF file download containing flight details.

## Testing APIs with Postman

You can test all the above APIs using the provided Postman collection. Import the `Flytbase-API-Collection.json`(link below) into Postman and send requests to your running server.

## How to Use the Postman Collection

### Step 1: Import the Collection
1. Download the Postman collection file from the following link:
   [Flytbase API Collection](https://drive.google.com/drive/folders/16LbMrhPlXURc-ArI0Q3ynutVJ9dO6p1Z?usp=sharing)
   
2. Open Postman on your system.

3. In the Postman app:
   - Click on **File** > **Import** or use the **Import** button on the top left of the Postman interface.
   - Choose the downloaded `Flytbase-API-Collection.json` file to import the collection.

### Step 2: Send Requests
1. Expand the imported collection in Postman to view all available API endpoints.
2. Select the desired API request and ensure that the parameters, headers, or body are correctly configured.
3. Click on the **Send** button to make the API call.
4. Review the response in Postman to validate functionality.

---

## Features of the Postman Collection
- **Pre-configured API Requests**: Easily test all available APIs without manual setup.
- **Customization**: Update request parameters, headers, or body to test specific scenarios.
- **Easy Integration**: Replace `{{baseURL}}` with your server's base URL for quick setup.
- **Error Handling**: View detailed responses for debugging and troubleshooting.

### Notes:
- Use **JWT tokens** for authentication. Include `Authorization: Bearer <token>` in the headers for all protected routes.
- Make sure MongoDB is running on `localhost:27017` or update `.env` with the correct MongoDB URI.

## Docker Setup

To dockerize the application, build the Docker image:

```bash
docker build -t flytbase-assignment .
```

Run the container:

```bash
docker run -p 1001:1001 flytbase-assignment
```

## Conclusion

This project provides a robust backend system to manage drones, missions, and flight logs. It includes essential features like mission simulation, flight log management, and mission assignment/removal from drones, with a clean and efficient architecture.
