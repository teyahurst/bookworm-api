# Link to live website: 
    https://bookworm-client.vercel.app/

# Link to the API: 
    https://github.com/teyahurst/bookworm-api

# Api documentation: 
    This api has 3 endpoints. 
    
        1) /api/auth
                an endpoint that gets a user with a username from the data for login and auth purposes.
                it also compares the users login password to the password stored in the database.

        2) /api/users
                an endpoint that checks the database to see if user already exists or can post a new user to the database.

        3) /:user_name/books
                an endpoint that checks for a specific user name and retrieves books for that username from the database
