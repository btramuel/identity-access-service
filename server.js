// ==
//  1. Purpose
//     The entry point for the whole app. This is the file Node
//     actually runs (npm start runs "node server.js"). It loads
//     environment variables, brings in the Express app from
//     app.js, and starts listening for requests on the chosen port.
//  2. Key Terms and Definitions
//     dotenv          - a small library that reads the .env file and
//                       puts the values onto process.env. We have to
//                       load this BEFORE anything that needs those
//                       values (like the JWT helper that reads
//                       JWT_SECRET).
//     process.env     - where Node keeps environment variables
//     app.listen      - tells Express to start the server on a port
//  3. Inputs
//     - PORT from .env (defaults to 8080 if not set)
//     - The Express app from app.js
//  4. Output
//     - A running server that takes HTTP requests
//  Plan
//  ==
//  1. Load .env right at the top
//  2. Bring in the Express app
//  3. Read the port from .env (or fall back to 8080)
//  4. Call app.listen and log a message when it starts
//  ==

require('dotenv').config();

const app = require('./src/app');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
