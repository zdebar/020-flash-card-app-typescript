# TODO

## Types
  dataTypes.ts
    WordData
    WordDataNew
    User
    UserLogin

  dataConversion.ts
    mapNewWordsToWordData

## Utils
  auth.utils.ts / more tests
    hashPassword
    comparePasswords
    createToken / should it accept User data type or UserLogin
    verifyToken

  db.utils.ts / more tests
    queryDatabase
    executeDatabase

  logger.utils.ts

## Repository
  user.repository.ts / if I dont need full User, use only UserLogin
    findUserByID
    findUserByEmail
    findUserByUsername / make tests
    insertUser / make tests
  
## Services
  auth.service.ts
    registerUserService / more tests
    loginUserService / more tests

  word.service.ts
    getNewWords / more tests
    getWordAlreadyPracticed / more tests
    getUserWords / more tests
    updateUserWords / more tests

## Middleware
  auth.middleware.ts / more tests

## Controllers
  auth.controller.ts
    registerUser / make tests
    loginUser / make tests

  user.controller.ts
    getUserWordsController / make tests
    updateUserWordsController / make tests
    getUserProfileController / make tests

## Routes
  auth.routes.ts / check
  user.routes.ts / check

