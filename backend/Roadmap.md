# TODO

## Server
  server.ts

## Routes
  auth.routes.ts 
  user.routes.ts 

## Controllers
  auth.controller.ts
    registerUser / accepts username, email, passwords -> registers user to database
    loginUser / accepts email, paswords -> upon authentication sends user JWT token

  user.controller.ts
    getUserProfileController / authenticate with JWT token -> findUserbyID -> sends User information + settings back
    getUserWordsController / authenticate with JWT token -> query database for words to practice -> sends words back
    updateUserWordsController / authenticate with JWT token -> update user progrest to database table user_words
     

## Middleware
  auth.middleware.ts

## Services
  auth.service.ts / make tests
    registerUserService 
    loginUserService

  word.service.ts
    getWordsPostgres / check if it will work even with entries in user_row
    updateWordsPostgres / make tests
    batchUpdateWordsPostgres / make tests

## Repository
  user.repository.ts
    findUserByIdPostgres
    findUserPreferencesByIdPostgres
    findUserByUsernamePostgres
    findUserByEmailPostgres
    insertUserPostgres

## Utils
  auth.utils.ts
    hashPassword
    comparePasswords
    createToken 
    verifyToken

  config.utils.ts
    convertSRSToSeconds

  logger.utils.ts

## Types
  dataTypes.ts
    Word
    User
    UserLogin
    UserSettings

  dataConversion.ts
    mapNewWordsToWordData

## Config
  config.ts
  databasePostgres.config.ts
  databaseSQLite.config.ts
