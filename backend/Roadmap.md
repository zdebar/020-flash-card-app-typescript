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
  auth.service.ts / repair tests
    registerUserService 
    loginUserService

  word.service.ts
    getWordsPostgress / check if it will work even with entries in user_row
    getWordAlreadyPracticed 
    getUserWords
    updateUserWords 

## Repository
  user.repository.ts
    findUserByID
    findUserByEmail
    findUserByUsername 
    insertUser

## Utils
  auth.utils.ts / so far not possible to run env variables in vscode tests
    hashPassword
    comparePasswords
    createToken 
    verifyToken

  db.utils.ts
    queryDatabase
    executeDatabase

  logger.utils.ts

## Types
  dataTypes.ts
    WordData
    WordDataNew
    User
    UserLogin

  dataConversion.ts
    mapNewWordsToWordData

## Config
  config.ts
  database.config.ts
