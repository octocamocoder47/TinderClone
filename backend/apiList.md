# TinderClone APIs

## authRouter
 - POST /signup
 - POST /login
 - POST /logout

## profileRouter
 - GET /profile/view
 - PATCH /profile/edit
 - PATCH /profile/password  // forgot password API

## connectionRequestRouter
 - POST /request/send/:status/:userID
 <!-- - POST /request/send/interested/:userID
 - POST /request/send/ignored/:userID -->
 
 - POST /request/review/:status/:requestID
 <!-- - POST /request/review/accepted/:requestID
 - POST /request/review/rejected/:requestID -->


## userRouter
 - GET /user/requests/received
 - GET /user/connections
 - GET /user/feed - Gets the profiles of other users on platform

