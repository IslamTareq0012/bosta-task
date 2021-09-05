# Node.js, Express and MongoDB Project Structure 
Bosta Task Project

# Features
- Fundamental of Express: routing, middleware, sending response and more
- Fundamental of Mongoose: Data models, data validation and middleware
- RESTful API including pagination and sorting
- CRUD operations with MongoDB
- Security: encyption, sanitization and more
- Authentication with JWT : login and signup
- Authorization (User roles and permissions)
- Error handling
- Enviroment Varaibles
- handling error outside Express
- Catching Uncaught Exception
- Sign-up with email verification.
- Stateless authentication using JWT.
- Users can create a check to monitor a given URL if it is up or down.
- Users can edit, pause, or delete their checks if needed.
- Users may receive a notification on a webhook URL by sending HTTP POST request whenever a check goes down or up.
- Users should receive email alerts whenever a check goes down or up.
- Users can get detailed uptime reports about their checks availability, average response time, and total uptime/downtime.
- Users can group their checks by tags and get reports by tag.
# Project Structure
- server.js : Responsible for connecting the MongoDB and starting the server.
- app.js : Configure everything that has to do with Express application. 
- config.env: for Enviroment Varaiables
- routes -> userRoutes.js: The goal of the route is to guide the request to the correct handler function which will be in one of the controllers
- controllers -> userController.js: Handle the application request, interact with models and send back the response to the client 
- models -> userModel.js: (Business logic) related to business rules, how the business works and business needs ( Creating new user in the database, checking if the user password is correct, validating user input data)
