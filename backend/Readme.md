# Backend Directory Structure

## Config

## Types

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

### auth.service.ts

#### registerUserService

#### loginUserService

#### getUserPreferences

### word.service.ts

#### getWordsPostgres

#### updateWordsPostgres

## Repository

### user.repository.ts

#### findUserByIdPostgres

    finds User by ID in database Postgres

#### findUserPreferencesByIdPostgres

    finds User byt with Preferences in database Postgres

#### findUserByUsernamePostgres

    finds User by Username in database Postgres

#### findUserByEmailPostgres

    finds User by Email in database Postgres

#### insertUserPostgres

    insert with username, email, hashedPassword to database Postgres

## Utils

### auth.utils.ts

#### hashPassword

    hashing password bcrypt, 10 salt rounds

#### comparePasswords

    compares password with hashed password for bcrypt

#### createToken

    creates jwt access token

#### verifyToken

    verify JWT token, and User info from decoded token

### config.utils.ts

#### convertSRSToSeconds

    converts SRS to array of seconds

### logger.utils.ts
