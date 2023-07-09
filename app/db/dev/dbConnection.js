/******************************************************************************
 *  @Execution      : default node : cmd> nodemon dbConnection.js
 *  @description    : This file is used to write the DB queries
 *  @file           : Backend ChatConnect Application
 *  @version        : 1.0
 *  @since          : 14-june-2023
 ******************************************************************************/

/*
required files
*/
import pool from './pool';
import { Constants } from '../../constants/sqlQueries';

pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create User Table
 */
const createUserTable = () => {
  const userCreateQuery = Constants.USER_TABLE_CREATION;

  return pool.query(userCreateQuery);
};

/**
 * Create user Accounts Table
 */
const userAccountsTable = () => {
  const userAccountQuery = Constants.ACCOUNTS_TABLE_CREATION;

  return pool.query(userAccountQuery);
};

/**
 * Create user conversation Table
 */
const userPostTable = () => {
  const userPostQuery = Constants.CONVERSATION_TABLE_CREATION;

  return pool.query(userPostQuery);
};

/**
 * Create user between conversation Table
 */
const userLikesTable = () => {
  const userLikeQuery = Constants.USER_CONVERSATION_TABLE_CREATION;

  return pool.query(userLikeQuery);
};

/**
 * Create user message Table
 */
const userCommentsTable = () => {
  const userCommentQuery = Constants.MESSAGE_TABLE_CREATION;

  return pool.query(userCommentQuery);
};


/**
 * Drop User Table
 */
const dropUserTable = () => {
  const usersDropQuery = Constants.DROP_TABLE;

  return pool.query(usersDropQuery);
};

/**
 * Create All Tables
 */
const createAllTables = async () => {
  try {
    // Execute table creation functions sequentially
    await createUserTable();
    await userAccountsTable();
    await userPostTable();
    await userLikesTable();
    await userCommentsTable();
    console.log("All tables created successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    pool.end(); // Terminate the pool after all queries have completed
  }
};

/**
 * Drop All Tables
 */
const dropAllTables = async () => {
  try {
    // Execute table dropping function
    await dropUserTable();
    console.log("All tables dropped successfully.");
  } catch (err) {
    console.error(err);
  } finally {
    pool.end(); // Terminate the pool after the query has completed
  }
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

export {
  createAllTables,
  dropAllTables,
};

// We require make-runnable package - We need this to be able to call any of our two functions from the terminal.
require('make-runnable');
