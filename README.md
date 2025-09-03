# Carrer Advisor  🚀



## 🛠️ Tech Stack

This project is built using the MERN stack.

* **Frontend:** React, Vite, Tailwind CSS (or your choice of CSS framework)
* **Backend:** Node.js, Express.js
* **Database:** MongoDB with Mongoose
* **Authentication:** JSON Web Tokens (JWT)

---

## ⚙️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following installed on your system:

* [Node.js](https://nodejs.org/en/) (v18.x or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* [MongoDB](https://www.mongodb.com/try/download/community) (Make sure it's running on your local machine or you have a cloud connection string)

### Installation & Setup

1.  **Fork and Clone the Repository**

    Fork the repository first and then clone it to your local machine:
    ```bash
    git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
    cd your-repository-name
    ```

2.  **Set up the Backend**

    Navigate to the backend directory, install dependencies, and set up your environment variables.
    ```bash
    # Move into the backend folder
    cd backend

    # Install dependencies
    npm install
    ```
  

    ```env
    # .env
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=a_very_strong_and_secret_key
    ```

3.  **Set up the Frontend**

    Open a **new terminal window** and navigate to the frontend directory from the project's root folder.
    ```bash
    # Move into the frontend folder from the root directory
    cd frontend

    # Install dependencies
    npm install
    ```

---

## 🚀 Running the Application

You need to have both the backend and frontend servers running simultaneously.

1.  **Start the Backend Server**

    In your terminal for the `backend` directory:
    ```bash
    node server.js
    ```
    Your backend server should now be running, typically on `http://localhost:5001`.

2.  **Start the Frontend Development Server**

    In your terminal for the `frontend` directory:
    ```bash
    npm run dev
    ```
    Your React application should now be running, typically on `http://localhost:5173`. Open this URL in your browser to see the project live!

---

## 📂 Folder Structure

The project repository is organized as follows:
