/******************************************************************************
 *  @Execution      : default node : cmd> nodemon server.js
 *  @description    : Root file for the server & control all the file and provide to required path
 *  @file           : Backend ChatConnect Application
 *  @version        : 1.0
 *  @since          : 14-june-2023
 ******************************************************************************/
/*
required files
*/
import 'babel-polyfill';
import express from 'express';
import cors from 'cors';
const swagger = require('./app/config/swagger');
import usersRoute from './app/routes/userRoute';
import chatRoute from './app/routes/chatRoute';
import env from './env';

const app = express();

// Add middleware for parsing URL encoded bodies (which are usually sent by browser)
app.use(cors());

// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Initialize Swagger
swagger(app);

// Use the Swagger route
app.use('/v1', usersRoute);
app.use('/v1', chatRoute);


app.listen(env.PORT).on('listening', () => {
    console.log(`🚀 are live on ${env.PORT}`);
});


export default app;