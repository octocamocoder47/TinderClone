# TinderClone APIs

## authRouter
 - POST /signup
 - POST /login
 - POST /logout

## profileRouter
 - GET /profile/view
 - PATCH /profile/edit
 - PATCH /profile/password

## connectionRequestRouter
 - POST /request/send/interested/:userID
 - POST /request/send/ignore/:userID
 - POST /request/review/accepted/:userID
 - POST /request/review/rejected/:userID

## userRouter
 - GET /user/connections
 - GET /user/requests
 - GET /user/feed - Gets the profiles of other users on platform

