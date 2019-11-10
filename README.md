# Public Server

- API is deployed to Heroku
- Used technologies are: NodeJS, Express, PostgreSQL, Redis
- API URL: https://leaderboardgj.herokuapp.com
- Swagger: https://leaderboardgj.herokuapp.com/swagger

# Local

- First, configure environment variables for your environment
- Config file is located in `server/config/config.json`
- Test and development databases should be different while only 1 Redis database is required
- Install packages with `npm i`

## Start Server

- `npm run dev`

## Test

- `npm test`

# Important Notes

- You can populate databases (Redis and Postgres) only with `POST API_URL/api/v1/user/populate` endpoint, otherwise, data integrity will fail. Therefore, if you want to test it with big data, you should use that endpoint for population.
- If you call population endpoint with a big count (in body), then Postman or Swagger UI will return an error due to timeout. Don't worry, the process will continue in the background.
- The first request to Heroku may take some time because it goes to sleep mode if not used frequently (free tier spec).

# Benchmark

- The code is tested on my local computer for 6 millions of users. It takes around 5 milliseconds to get TOP 10 users. It also takes around 5 milliseconds to get users between X1 and X2 scores with pagination. So, pagination does not affect the performance.