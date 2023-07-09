/******************************************************************************
 *  @Execution      : default node : cmd> nodemon usersController.js
 *  @description    : This file is control the logic
 *  @file           : Backend ChatConnect Application
 *  @version        : 1.0
 *  @since          : 14-june-2023
 ******************************************************************************/
/*
required files
*/
import moment from 'moment';
import dbQuery from '../db/dev/dbQuery';

import {
    hashPassword,
    comparePassword,
    isValidEmail,
    validatePassword,
    isEmpty,
    generateUserToken,
} from '../helpers/validations';

import { errorMessage, successMessage, status } from '../helpers/status';
import { Constants } from '../constants/sqlQueries';
import sendmail from '../config/sendMail';
import { HtmlConstants } from '../constants/htmlContent';
import env from '../../env';

// Define and initialize the timeZoneOffset variable
const timeZoneOffset = '+05:30'; // Example: Set the offset to +5 hours

/*********************************************************************************
 * Create A User
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 *********************************************************************************/
const createUser = async (req, res) => {
    const { email, username, first_name, last_name, password } = req.body;

    // Timestamp for user creation
    const created_on = moment().format('YYYY-MM-DD HH:mm:ss');
    const updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

    // Parameter Check
    if (isEmpty(email) || isEmpty(username) || isEmpty(first_name) || isEmpty(last_name) || isEmpty(password)) {
        const errorMessage = {
            error: 'Email, password, first name, and last name field cannot be empty'
        };
        return res.status(status.bad).send(errorMessage);
    }

    // Email Validation
    if (!isValidEmail(email)) {
        const errorMessage = {
            error: 'Please enter a valid Email'
        };
        return res.status(status.bad).send(errorMessage);
    }

    // Password validation
    if (!validatePassword(password)) {
        const errorMessage = {
            error: 'Password must be more than five (5) characters'
        };
        return res.status(status.bad).send(errorMessage);
    }

    // Password encryption
    const hashedPassword = hashPassword(password);

    // DB query used to ingest a user with provided values
    const createUserQuery = Constants.REGISTER_QUERY;
    const addEntryInAccountTable = Constants.USER_PROFILE_CREATE;
    const values1 = [
        email,
        username,
        first_name,
        last_name,
        hashedPassword,
        created_on,
        updated_at
    ];

    try {
        const { rows } = await dbQuery.query(createUserQuery, values1);
        const dbResponse = rows[0];
        delete dbResponse.password;
        dbResponse.created_on = moment(dbResponse.created_on).utcOffset(timeZoneOffset).format('YYYY-MM-DD HH:mm:ss');
        dbResponse.updated_at = moment(dbResponse.updated_at).utcOffset(timeZoneOffset).format('YYYY-MM-DD HH:mm:ss');

        console.log("create user dbResponse ::::: ", dbResponse);

        // A token has been generated for the logged-in user and attached to the response
        const token = await generateUserToken(dbResponse.email, dbResponse.id, dbResponse.first_name, dbResponse.last_name, dbResponse.username, moment(dbResponse.created_on).utcOffset(timeZoneOffset).format('YYYY-MM-DD HH:mm:ss'));
        successMessage.data = dbResponse;

        // User full name
        const userFullName = `"${successMessage.data.first_name} ${successMessage.data.last_name}"`;
        const subject = `Action Required: Verify Your Account for ${userFullName}`;
        const verificationUrl = `${env.SERVER_URL}:${env.PORT}/v1/verification?token=${encodeURIComponent(token)}`;

        const url = HtmlConstants.geterificationContent(verificationUrl);

        // Send mail for verification
        sendmail.sendmailServices(url, subject, true);
        successMessage.message = "Signup email has been sent successfully! Please check your email and verify your account";

        // User registers in the account table as well
        const values2 = [
            dbResponse.id, // Assuming you have a user ID associated with the request
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            created_on, // created_on timestamp
            updated_at // updated_at timestamp
        ];
        const { rows: rows2 } = await dbQuery.query(addEntryInAccountTable, values2);

        return res.status(status.created).send(successMessage);
    } catch (error) {
        console.log("error ", error);
        if (error.routine === '_bt_check_unique') {
            const errorMessage = {
                error: 'User with that EMAIL already exists'
            };
            return res.status(status.conflict).send(errorMessage);
        }
        const errorMessage = {
            error: 'Operation was not successful'
        };
        return res.status(status.error).send(errorMessage);
    }
};



/***********************************************************************************
* delete
* @param {object} req
* @param {object} res
* @returns {object} user object
**********************************************************************************/
const deleteUser = async (req, res) => {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
        const errorMessage = { error: 'Email is missing' };
        return res.status(status.bad).send(errorMessage);
    }

    try {
        await dbQuery.query('BEGIN');

        const deleteCommentsQuery = Constants.DELETE_COMMENTS_QUERY;
        const deleteLikesQuery = Constants.DELETE_LIKES_QUERY;
        const deletePostsQuery = Constants.DELETE_POSTS_QUERY;
        const deleteAccountsQuery = Constants.DELETE_ACCOUNTS_QUERY;
        const deleteUserQuery = Constants.DELETE_USER_QUERY;

        // Delete comments associated with the user
        await dbQuery.query(deleteCommentsQuery, [email]);

        // Delete likes associated with the user
        await dbQuery.query(deleteLikesQuery, [email]);

        // Delete posts associated with the user
        await dbQuery.query(deletePostsQuery, [email]);

        // Delete accounts associated with the user
        await dbQuery.query(deleteAccountsQuery, [email]);

        // Delete the user
        const { rowCount: userRowCount } = await dbQuery.query(deleteUserQuery, [email]);

        // If user with the provided email does not exist
        if (userRowCount === 0) {
            const errorMessage = { error: 'User with this email does not exist' };
            return res.status(status.notfound).send(errorMessage);
        }

        // Commit the transaction
        await dbQuery.query('COMMIT');

        const successMessage = {
            message: 'User and related records deleted successfully',
        };
        return res.status(status.success).send(successMessage);
    } catch (error) {
        console.log("Error: ", error);

        // Rollback the transaction if an error occurs
        await dbQuery.query('ROLLBACK');

        const errorMessage = { error: 'Operation was not successful' };
        return res.status(status.error).send(errorMessage);
    }
};


/***********************************************************************************
* fetch all the users
* @param {object} req
* @param {object} res
* @returns {object} user object
**********************************************************************************/
const getAllUsers = async (req, res) => {

    // db query used to fetch all the users
    const getAllUserQuery = Constants.GETALLUSER_QUERY;

    try {
        const { rows, rowCount } = await dbQuery.query(getAllUserQuery, null);
        console.log(": rows ", rows)

        // If no users found
        if (rowCount === 0) {
            const errorMessage = { error: 'No records found' };
            return res.status(status.notfound).send(errorMessage);
        }

        // Response structure
        const finalResponse = [];

        rows.forEach(user => {
            finalResponse.push({
                userName: user.username,
                email: user.email,
                requestedDate: moment(user.created_on).utcOffset(timeZoneOffset).format('YYYY-MM-DD HH:mm:ss'),
                verification: user.verification
            });
        });

        const successMessage = finalResponse;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        console.log(": Error ", error)
        const errorMessage = { error: 'Operation was not successful' };
        return res.status(status.error).send(errorMessage);
    }
};


/***********************************************************************************
* signin
* @param {object} req
* @param {object} res
* @returns {object} user object
**********************************************************************************/
const signInUser = async (req, res) => {
    const { email, password } = req.body;

    // Email & Password Check
    if (isEmpty(email) || isEmpty(password)) {
        errorMessage.error = 'Email or Password detail is missing';
        return res.status(status.bad).send(errorMessage);
    }

    // Password Validation
    if (!isValidEmail(email) || !validatePassword(password)) {
        errorMessage.error = 'Please enter a valid Email or Password';
        return res.status(status.bad).send(errorMessage);
    }

    // Find the user in the existing table based on req params
    const signinUserQuery = Constants.LOGIN_QUERY;
    try {
        // Call the database query function with signinUserQuery and [email] as parameters
        // Replace `dbQuery.query()` with the appropriate database query function
        const { rows } = await dbQuery.query(signinUserQuery, [email]);
        const dbResponse = rows[0];
        console.log("dbResponse :::: ", dbResponse)

        // If email doesn't exist
        if (!dbResponse) {
            errorMessage.error = 'User with this email does not exist';
            return res.status(status.notfound).send(errorMessage);
        }

        // User is not verified. Please verify user before login
        if (dbResponse.verification === false) {
            errorMessage.error = 'User is not verified. Please verify user before login';
            return res.status(status.notfound).send(errorMessage);
        }

        // Compare the user password
        if (!comparePassword(dbResponse.password, password)) {
            errorMessage.error = 'The password you provided is incorrect';
            return res.status(status.bad).send(errorMessage);
        }

        // Generate a token for the user
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.first_name, dbResponse.last_name, dbResponse.username, moment(dbResponse.created_on).utcOffset(timeZoneOffset).format('YYYY-MM-DD HH:mm:ss'));

        // Remove the password field from the response
        delete dbResponse.password;
        dbResponse.created_on = moment(dbResponse.created_on).utcOffset(timeZoneOffset).format('YYYY-MM-DD HH:mm:ss');
        dbResponse.updated_at = moment(dbResponse.updated_at).utcOffset(timeZoneOffset).format('YYYY-MM-DD HH:mm:ss');

        // Set the token in the response data
        successMessage.data = dbResponse;
        successMessage.data.token = token;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        console.log("Error : ", error)
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};


/***********************************************************************************
* verification
* @param {object} req
* @param {object} res
* @returns {object} user object
**********************************************************************************/
const verification = async (req, res) => {
    const { email, user_id } = req.user;

    // Find the user in the existing table based on req params
    const signinUserQuery = Constants.FETCHDATA_QUERY;
    try {
        // Call the database query function with signinUserQuery and [email, user_id] as parameters
        // Replace `dbQuery.query()` with the appropriate database query function
        const { rows } = await dbQuery.query(signinUserQuery, [email, user_id]);
        const dbResponse = rows[0];

        // Remove the password field from the response
        delete dbResponse.password;

        // If email doesn't exist
        if (!dbResponse) {
            errorMessage.error = 'User with this email does not exist';
            return res.status(status.notfound).send(errorMessage);
        }

        successMessage.message = `User verification successful. You can now proceed to login`;
        successMessage.data = {
            email: dbResponse.email,
            verification: dbResponse.verification
        };

        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Error in user verification! Please try again';
        return res.status(status.error).send(errorMessage);
    }
};


/***********************************************************************************
* forgotPassword
* @param {object} req
* @param {object} res
* @returns {object} user object
**********************************************************************************/
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Find the user in the existing table based on req params
    const signinUserQuery = Constants.LOGIN_QUERY;
    try {
        // Call the database query function with signinUserQuery and [email] as parameters
        // Replace `dbQuery.query()` with the appropriate database query function
        const { rows } = await dbQuery.query(signinUserQuery, [email]);
        const dbResponse = rows[0];

        // If email doesn't exist
        if (!dbResponse) {
            errorMessage.error = 'User with this email does not exist';
            return res.status(status.notfound).send(errorMessage);
        }

        // Generate a token for password reset
        const token = generateUserToken(dbResponse.email, dbResponse.id, dbResponse.first_name, dbResponse.last_name, dbResponse.username, moment(dbResponse.created_on).utcOffset(timeZoneOffset).format('YYYY-MM-DD HH:mm:ss'));

        successMessage.message = `We've sent password reset instructions to the primary email address on the account`;
        successMessage.data = {
            email: dbResponse.email,
            username: dbResponse.username,
            token: token
        };

        const verificationUrl = `${env.SERVER_URL}:${env.PORT}/v1/resetPasswordHtmlPage?token=${encodeURIComponent(token)}`;
        const tokenData = HtmlConstants.getTokenContent(verificationUrl);

        const subject = `Password Reset Request for :: ${dbResponse.first_name} ${dbResponse.last_name}`;

        // Call the sendmail service with tokenData, subject, and true as parameters
        // Replace `sendmail.sendmailServices()` with the appropriate function for sending emails
        sendmail.sendmailServices(tokenData, subject, true);

        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Error during forgot password! Please try again';
        return res.status(status.error).send(errorMessage);
    }
};


/***********************************************************************************
* resetPassword
* @param {object} req
* @param {object} res
* @returns {object} user object
**********************************************************************************/
const resetPassword = async (req, res) => {
    const { email } = req.user;
    const { password, confirmPassword } = req.body;

    // Find the user in the existing table based on req params
    const resetPasswordQuery = Constants.RESETPASS_QUERY;
    try {
        // Password and ConfirmPassword should be the same
        if (password !== confirmPassword) {
            errorMessage.error = 'Password and confirm password should be the same';
            return res.status(status.bad).send(errorMessage);
        }

        // Password validation
        if (!validatePassword(password)) {
            errorMessage.error = 'Password must be more than five (5) characters';
            return res.status(status.bad).send(errorMessage);
        }

        // Password encryption
        const hashedPassword = hashPassword(password);

        // Call the database query function with resetPasswordQuery and [hashedPassword, email] as parameters
        // Replace `dbQuery.query()` with the appropriate database query function
        const { rows } = await dbQuery.query(resetPasswordQuery, [hashedPassword, email]);
        const dbResponse = rows[0];

        // If email doesn't exist
        if (!dbResponse) {
            errorMessage.error = 'User with this email does not exist';
            return res.status(status.notfound).send(errorMessage);
        }

        successMessage.message = 'Password reset successfully!';
        successMessage.data = {
            email: dbResponse.email,
            username: dbResponse.username
        };

        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'Error in resetting password! Please try again.';
        return res.status(status.error).send(errorMessage);
    }
};


/***********************************************************************************
* resetPasswordFromHTMLPage
* @param {object} req
* @param {object} res
* @returns {object} user object
**********************************************************************************/
const resetPasswordFromHTMLPage = async (req, res) => {
    const paramToken = req.url.split("token=")[1];
    try {
        const tokenData = HtmlConstants.resetPasswordSubmitPage(paramToken);
        return res.send(tokenData);
    } catch (error) {
        console.log(error);
        errorMessage.error = 'Error! Please try again.';
        return res.status(status.error).send(errorMessage);
    }
};


export {
    createUser,
    signInUser,
    deleteUser,
    getAllUsers,
    verification,
    forgotPassword,
    resetPassword,
    resetPasswordFromHTMLPage
};