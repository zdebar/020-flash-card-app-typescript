# TODO

## Config
  config.ts
  database.config.ts

## Types
  dataTypes.ts
    WordData
    WordDataNew
    User
    UserLogin

  dataConversion.ts
    mapNewWordsToWordData

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

## Repository
  user.repository.ts
    findUserByID
    findUserByEmail
    findUserByUsername 
    insertUser
  
## Services
  auth.service.ts / repair tests
    registerUserService 
    loginUserService

  word.service.ts
    getNewWords
    getWordAlreadyPracticed 
    getUserWords
    updateUserWords 

## Middleware
  auth.middleware.ts

## Controllers
  auth.controller.ts
    registerUser 
    loginUser 

  user.controller.ts
    getUserWordsController 
    updateUserWordsController 
    getUserProfileController 

## Routes
  auth.routes.ts / repair tests
  user.routes.ts / check

