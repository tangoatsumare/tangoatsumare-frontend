# Tango Atsumare

> "Tango Atumare" is a word study application for learners of Japanese.

## Features

- OCR to Flashcard
- SRS Review
- Picture Dictionary

# 👨‍💻 Tech stack

- Frontend: TypeScript、React Native、Cloud Vision API、Expo
- Backend : TypeScript、node.js、Express、HEROKU
  https://github.com/tangoatsumare/tangoatsumare-api-ts
- Database : mongoDB
- Authentication : Firebase
- Storage : Firebase

## Endpoints

#### Users

- GET /api/users
- GET /api/users/:id
- GET /api/usersuid/:uid
- POST /api/users
- PATCH /api/users/:uid
- DELETE /api/users/:id

#### Flashcards

- GET /api/flashcards
- GET /api/flashcards/:id
- GET /api/flashcardsby/:uid
- POST /api/flashcards
- PATCH /api/flashcards/:id
- DELETE /api/flashcards/:id

#### Users_to_Cards

- GET /api/userstocards
- POST /api/userstocards
- PATCH /api/userstocards/:id
- PATCH /api/userstocards/
- DELETE /api/userstocards/:id

#### Users_to_Cards and Flashcards Jointable

- GET /api/cardflashjoin/:id
- GET /api/cardflashjoinuid/:uid

#### Tags

- GET /api/tags
- GET /api/tags/:id
- POST /api/tags
- PATCH /api/tags/:id
- DELETE /api/tags/:id
