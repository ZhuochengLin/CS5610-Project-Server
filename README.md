# CS5610-Project-Server
## API Endpoint
All endpoints that create/update/delete data will need a logged-in user to use. 
Only admin account can manipulate other user's data.
### users
Private fields: ```["password", "email", "phone", "birthday"]```
* GET ```/api/users``` Find all users
* GET ```/api/users/:uid``` Find user by id
* POST ```/api/users``` Create user
* PUT ```/api/users/:uid``` Update user
* DELETE ```/api/users/:uid``` Delete user
* DELETE ```/api/users``` Delete all users

### movies:
* GET ```/api/movies/config``` Get configuration from TMDB API
* GET ```/api/movies/:mid``` Find movie details by ID
* GET ```/api/movies/popular/:page``` Find popular movies at page n
* GET ```/api/movies/now-playing/:page``` Find movies now playing in theater at page n
* GET ```/api/movies/top-rated/:page``` Find top rated movies at page n
* GET ```/api/movies/upcoming/:page``` Find upcoming movies at page n
* GET ```/api/movies/:mid/recommendations/:page``` Get recommendation from movie at page n
* GET ```/api/movies/:mid/credits``` Get movie credits
* GET ```/api/search``` Search movies
  * Search params:
    * ```query```: string, the query string
    * ```page```: number, the page to retrieve

### movie lists:
* GET ```/api/movie-lists``` Find all movie lists
* GET ```/api/movie-lists/:lid``` Find movie list by ID
* GET ```/api/movie-lists/name/:lname``` Find movie list by list name
* GET ```/api/users/:uid/movie-lists``` Find all movie lists owned by user
* POST ```/api/users/:uid/movie-lists``` Create movie list
* PUT ```/api/users/:uid/movie-lists/:lid``` Update movie list
* DELETE ```/api/movie-lists``` Delete all movie lists
* DELETE ```/api/movie-lists/:lid``` Delete movie list by ID

### movie reviews
* GET ```/api/movie-reviews``` Find all reviews
* GET ```/api/users/:uid/movie-reviews``` Find all reviews owned by user
* GET ```/api/movies/:mid/movie-reviews``` Find all reviews of movie
* GET ```/api/movie-reviews/:rid``` Find review by ID
* GET ```/api/users/:uid/movie-reviews/:rid``` Find review owned by user
* POST ```/api/users/:mid/movie-reviews``` Create move review
* PUT ```/api/users/:uid/movie-reviews/:rid``` Update movie review
* DELETE ```/api/movie-reviews``` Delete all reviews
* DELETE ```/api/users/:uid/movie-reviews/:rid``` Delete review by id

### cloudinary
* GET ```/api/cloudinary/media``` Find all cloud media
* DELETE ```/api/cloudinary/media``` Delete trash data

### auth
* POST ```/api/auth/register``` Register
* POST ```/api/auth/login``` Login
* POST ```/api/auth/profile``` Profile
* POST ```/api/auth/logout``` Logout

### review likes
* GET ```/api/review-likes``` Find all likes
* GET ```/api/users/:uid/review-likes``` Find all reviews liked by user
* GET ```/api/users/:uid/review-likes/:rid``` Find user likes review
* POST ```/api/users/:uid/review-likes/:rid``` User likes review
* DELETE ```/api/review-likes``` Delete all likes

### follows
* GET ```/api/follows``` Find all follows
* GET ```/api/users/my/followings``` Find all followings
* GET ```/api/users/:uida/follows/:uidb``` Find user A follows user B
* GET ```/api/users/:uid/followers``` Find all followers
* POST ```/api/users/:uida/follows/:uidb``` User A follows user B
* DELETE ```/api/follows``` Delete all follows

### movie likes
* GET ```/api/movie-likes``` Get all likes
* GET ```/api/users/:uid/movie-likes``` Find all movies liked by user
* GET ```/api/users/:uid/movie-likes/:mid``` Find user likes movie
* POST ```/api/users/:uid/movie-likes/:mid``` User likes movie
* DELETE ```/api/movie-likes``` Delete all likes

### movie stats
* GET ```/api/movie-stats/:mid``` Find movie stats