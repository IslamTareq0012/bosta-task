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
- Observer design pattern used to make multiple notifiers.
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

- utils -> Folder to contains all tools and shared code to the whole project.


# Endpoints Curl Calls

## Checks

### Create Check
```bash
curl --location --request POST 'http://localhost:3000/api/v1/checks/createCheck' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzQ4NjhkOTU4MTE2MWFhODU4NWUxZCIsImVtYWlsIjoiaXNsYW1fZWxtYXNyeUBob3RtYWlsLmNvbSIsImlhdCI6MTYzMDgzMjMxMSwiZXhwIjoxNjMzNDI0MzExfQ.FtZG7blVSxPjEFtwIhvk0MuI6NAD9n8c81jiBhMMrAM' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "islam-check",
    "url": "www.google.com",
    "protocol": "HTTPS",
    "path": "",
            "Port": 1000,
            "webhook": "https://webhook.site/c56f64e1-999a-4a3a-9c65-721f613d1e9f",
            "timeout": "10000",
            "interval": 600000,
            "threshold": 1,
            "authentication": {
                "name":"islam",
                "password":"1234566"
            },
            "headers": [{
                "name":"header1",
                "value":"value1"
            }],
            "assertCode": 200,
            "tags": ["tag1"],
            "ignoreSSL": false,
            "user": "6134868d9581161aa8585e1d"
}'
```


### Pool a Check
```bash
curl --location --request GET 'http://localhost:3000/api/v1/checks/test?id=613489ad9581161aa8585e1f' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMzQ4NjhkOTU4MTE2MWFhODU4NWUxZCIsImVtYWlsIjoiaXNsYW1fZWxtYXNyeUBob3RtYWlsLmNvbSIsImlhdCI6MTYzMDgzMjMxMSwiZXhwIjoxNjMzNDI0MzExfQ.FtZG7blVSxPjEFtwIhvk0MuI6NAD9n8c81jiBhMMrAM'
```

## User Endpoint

``` bash
curl --location --request POST 'http://localhost:3000/api/v1/users/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "islam_elmasry@hotmail.com",
    "password": "123456789"
}'
```
