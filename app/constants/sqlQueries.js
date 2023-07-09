/******************************************************************************
 *  @description    : Contant file for all the fix values
 *  @file           : Backend ChatConnect Application
 *  @version        : 1.0
 *  @since          : 14-june-2023
 ******************************************************************************/

// Exporting the constants as a class
export class Constants {

  /**
   * users: This table stores information about registered users.
   */
  static USER_TABLE_CREATION = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    password VARCHAR(100) NOT NULL,
    created_on TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    verification BOOLEAN DEFAULT false)`;

  static ACCOUNTS_TABLE_CREATION = `CREATE TABLE IF NOT EXISTS accounts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users (id),
      account_type VARCHAR(20),
      bio TEXT,
      mobile VARCHAR(15),
      profile_image_url VARCHAR(255),
      dob DATE,
      gender VARCHAR(10),
      links TEXT[],
      created_on TIMESTAMP NOT NULL,
      updated_at TIMESTAMP NOT NULL
    )`;

  /**
   * conversations: This table represents individual conversations between users. It includes columns for id (unique identifier), name (optional name for the conversation), and created_at (timestamp of conversation creation).
   */
  static CONVERSATION_TABLE_CREATION = `
    CREATE TABLE IF NOT EXISTS conversations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_on DATE NOT NULL
    );
  `;

  /**
 * user_conversations: This table establishes a many-to-many relationship between users and conversations. It includes columns for id (unique identifier), user_id (foreign key referencing users.id), conversation_id (foreign key referencing conversations.id), and created_at (timestamp of the association creation). This table allows a user to be part of multiple conversations, and a conversation to have multiple users.
 */
  static USER_CONVERSATION_TABLE_CREATION = `
    CREATE TABLE IF NOT EXISTS user_conversations (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL,
      conversation_id INT NOT NULL,
      created_on DATE NOT NULL
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE
    );
  `;

  /**
 * messages: This table stores the messages sent within conversations. It includes columns for id (unique identifier), conversation_id (foreign key referencing conversations.id), sender_id (foreign key referencing users.id), message (content of the message), and timestamp (timestamp of message creation). The conversation_id and sender_id columns establish relationships between messages, conversations, and users.
 */
  static MESSAGE_TABLE_CREATION = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      conversation_id INT NOT NULL,
      sender_id INT NOT NULL,
      message TEXT NOT NULL,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      FOREIGN KEY (conversation_id) REFERENCES conversations (id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
    );
  `;

  // Drop Table
  static DROP_TABLE = 'DROP TABLE IF EXISTS users'
  static REGISTER_QUERY = `INSERT INTO
      users(email, username, first_name, last_name, password, created_on, updated_at)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;
  static LOGIN_QUERY = 'SELECT * FROM users WHERE email = $1 AND verification = true';
  static USERNAME_QUERY = 'SELECT * FROM users WHERE username $1 AND id = $2';
  static FETCHDATA_QUERY = `UPDATE users SET verification = true WHERE email = $1 AND id = $2 RETURNING *`;
  static DELETE_QUERY = 'DELETE FROM users WHERE email = $1 AND verification = true';
  static UPDATE_QUERY = ''; // Add your update query here
  static GETALLUSER_QUERY = 'SELECT * FROM users;'
  static RESETPASS_QUERY = `UPDATE users SET password = $1 WHERE email = $2 RETURNING *`;

  // Conversation
  static USER_CONVERSATION = `INSERT INTO conversations (name, created_on) VALUES ($1, $2) RETURNING *`;
  static GET_ALL_CONVERSATION = `SELECT * FROM conversations`;
  static GET_SPECIFIC_CONVERSATION = `SELECT * FROM conversations WHERE id = $1`;
  static UPDATE_CONVERSATION = `UPDATE conversations SET name = $1 WHERE id = $2 RETURNING *`
  static DELETE_CONVERSATION = `DELETE FROM conversations WHERE id = $1`;

  // Accounts
  static USER_PROFILE_CREATE = `INSERT INTO accounts (user_id, account_type, bio, mobile, profile_image_url, dob, gender, links, created_on, updated_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
}
