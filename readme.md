# Chat Application with WebSocket and MongoDB

This is a real-time chat application built using Node.js, Express, and Socket.io. It includes features like user authentication, message history, spam prevention, banning/unbanning users, and more.

## Features

- **Real-time chat**: Users can send messages to each other in real-time using WebSocket.
- **Authentication**: JWT tokens are used for authenticating users.
- **Message History**: The application stores chat history in a MongoDB database.
- **Spam Prevention**: Users who send messages too quickly are temporarily blocked from sending further messages.
- **Admin Commands**: Admin users can ban/unban users, set chat speed, and perform other administrative actions.
- **User Roles**: Users have different roles like Admin and Owner, each with specific permissions.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for Node.js to handle routes and HTTP requests.
- **Socket.io**: Used for enabling real-time communication between the client and server.
- **MongoDB**: NoSQL database to store messages, user data, and banned users.
- **JWT (JSON Web Token)**: Used for secure user authentication.
- **Cors**: Middleware to enable Cross-Origin Resource Sharing for specific domains.

## Setup and Installation

### Prerequisites

- Node.js (v14 or above)
- MongoDB instance running locally or in the cloud
- `.env` file containing your environment variables (`SKEY`, `PORT`, etc.)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:  
   Create a `.env` file in the root of the project with the following contents:
   ```env
   SKEY=<your_jwt_secret_key>
   WEBHOOKDC=
   ```

4. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

5. **Start the server**:
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000` or a port specified in the `.env` file.

## API Routes

### `POST /api/auth/login`
- **Description**: Logs in the user and returns a JWT token.
- **Body**: 
  ```json
  {
    "username": "user",
    "password": "password"
  }
  ```

### WebSocket Events

- **`chat message`**: Users can send chat messages.
- **`get messages`**: Retrieve the last 50 chat messages.
- **`user amount`**: Emits the current number of users online.
- **`shout`**: A broadcast event for shouted messages (only admin can trigger).

### Admin Commands

- `/help`: List available commands.
- `/ban <username>`: Ban a user from the chat.
- `/unban <username>`: Unban a previously banned user.
- `/chatspeed <number>`: Set the speed of the chat message processing.
- `/shout <message>`: Broadcast a message to all users.
- `/admin <username>`: Promote a user to admin (Owner only).

## Database Schema

- **User**: Stores user details such as username, password, role, and IP address.
- **Message**: Stores chat messages with timestamp, username, and message content.
- **Ban**: Stores banned users by IP address with a reason.

## Security Considerations

- JWT tokens are used for secure authentication.
- The server uses environment variables to manage sensitive data, such as secret keys.
- All routes are logged, and all incoming requests are verified to prevent spam and abuse.

## Contribution

Feel free to fork the project, make changes, and submit pull requests. Please ensure all pull requests are well-documented and include tests where applicable.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Socket.io](https://socket.io/) for real-time communication.
- [MongoDB](https://www.mongodb.com/) for the database.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for authentication.
- [Cors](https://www.npmjs.com/package/cors) for enabling CORS.

