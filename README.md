# Car Blog

## Users may post their favorite cars and discuss them in a comment section. 

Project is hosted on AWS and may be viewd at http://147.93.118.154:3002/cars

Features:
* user athentication: sign up and sign in with username and password
* users may upload links to images of their favorite cars
* users may create, read, update and delete cars and posts
* users may not update or delete posts of other users
* user data is saved in database

Technologies:
* HTML, CSS, Javascript
* Express - server for routing and requests
* Mongoose - to interact with DB
* MongoDB - database
* bcrypt - encrypt passwords
* connect-mongo - to persist sessions
* dotenv - to use environment variables
* ejs - templating
* express-session - sessions
* method-override - handle put and delete requests
* AWS - host project
* git - version control
* github - host repository