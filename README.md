# CS5610-Project-Server
## API Endpoint
### users
* GET ```/api/users``` Find all users
* GET ```/api/users/:uid``` Find user by id
* POST ```/api/users``` Create user
* PUT ```/api/users/:uid``` Update user
* DELETE ```/api/users/:uid``` Delete user

### movies:
* GET ```/api/movies/:mid``` Find movie details by ID
* GET ```/api/movies/popular/:page``` Find popular movies at page n
* GET ```/api/movies/nowplaying/:page``` Find movies now playing in theater at page n
* GET ```/api/movies/toprated/:page``` Find top rated movies at page n
* GET ```/api/movies/upcoming/:page``` Find upcoming movies at page n

### movie lists:
* GET ```/api/movie-lists``` Find all movie lists
* GET ```/api/movie-lists/:lid``` Find movie list by ID
* GET ```/api/movie-lists/name/:lname``` Find movie list by list name
* GET ```/api/users/:uid/movie-lists``` Find all movie lists owned by user
* POST ```/api/users/:uid/movie-lists``` Create movie list
* PUT ```/api/movie-lists/:lid``` Update movie list
* DELETE ```/api/movie-lists``` Delete all movie lists
* DELETE ```/api/movie-lists/:lid``` Delete movie list by ID

