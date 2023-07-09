/******************************************************************************
 *  @overview       : BidMentor is an innovative and interactive learning platform designed to revolutionize the way individuals acquire knowledge
 *  @file           : Backend ChatConnect Application
 *  @version        : 1.0
 *  @since          : 14-june-2023
 ******************************************************************************/
/*
required files
*/
import dotenv from 'dotenv';
dotenv.config();

export default {
    DATABASE_URL: process.env.DATABASE_URL, // postgres://{db_username}:{db_password}@{localhost}:{port}/{db_name}
    PORT: process.env.PORT,
    SECRET: process.env.SECRET,
    NODE_ENV: process.env.NODE_ENV || 3000,

    MAIL_FROM: process.env.MAIL_FROM,
    email: process.env.email,
    password: process.env.password,

    SERVICE: process.env.SERVICE,
    HOST: process.env.HOST,
    ADDRESS: process.env.ADDRESS,
    MAIL_PORT: process.env.MAIL_PORT,
    SERVER_URL: process.env.SERVER_URL || 'http://localhost',
}