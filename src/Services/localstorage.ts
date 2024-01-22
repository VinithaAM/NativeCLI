import {useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';

const dbName = 'MyDatabase.db';
const dbVersion = '1.0';
const dbDisplayName = 'My Database';
const dbSize = 200000;

const db = SQLite.openDatabase({name: dbName, location: 'default'});

// Create table if not exists
useEffect(() => {
  createTable();
}, []);

const createTable = async () => {
  (await db).transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS UserDetails (id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, UserName TEXT,Profilepic BLOB)',
      [],
      (results: any) => {
        console.log('Table created successfully');
      },
      (error: any) => {
        console.log('Error creating table:', error);
      },
    );
  });
};

// CRUD operations

// Create
export const createUser = async (name: any, email: any, profile: any) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction(tx => {
      tx.executeSql(
        'INSERT INTO users (Name, UserName,Profilepic) VALUES (?, ?,?)',
        [name, email, profile],
        (tx, results) => {
          resolve(results.insertId);
        },
        error => {
          reject(error);
        },
      );
    });
  });
};

// Read
export const getUsers = () => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction(tx => {
      tx.executeSql('SELECT * FROM users', [], (tx, results) => {
        const rows = results.rows.raw();
        resolve(rows);
      });
    });
  });
};

// Update
export const updateUser = (id: any, name: any, email: any) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction(tx => {
      tx.executeSql(
        'UPDATE users SET name=?, email=? WHERE id=?',
        [name, email, id],
        (tx, results) => {
          resolve(results.rowsAffected);
        },
      );
    });
  });
};

// Delete
export const deleteUser = (id: any) => {
  return new Promise(async (resolve, reject) => {
    (await db).transaction(tx => {
      tx.executeSql('DELETE FROM users WHERE id=?', [id], (tx, results) => {
        resolve(results.rowsAffected);
      });
    });
  });
};
// const createTable = async () => {
//     if (db) {
//       db.executeSql(
//         'CREATE TABLE IF NOT EXISTS ' +
//           'UserDetails' +
//           '(Id INTEGER PRIMARY KEY AUTOINCREMENT ,Name TEXT, UserName TEXT,Profilepic BLOB)',
//       ),
//         [],
//         (txObj: any, result: any) => {
//           console.log('init', 'table', result);
//           console.log('Table Created Successfully');
//         },
//         (txObj: any, error: any) => {
//           console.log('init', 'table', error);
//           console.log('Create table error', error);
//         };
//     } else {
//       console.error('Database initialization failed.');
//     }

//   };

// const tableCreation = async (db: any) => {
//     if (db) {
//       // await db.transaction(async tnx => {
//       //   console.log('int', tnx);
//       //   tnx.tnx.executeSql(
//       //     'CREATE TABLE IF NOT EXISTS ' +
//       //       'UserDetails' +
//       //       '(Id INTEGER ,Name TEXT, UserName TEXT,Profilepic BLOB)',
//       //   ),
//       //     [],
//       //     (txObj: any, result: any) => {
//       //       console.log('init', 'table', result);
//       //       console.log('Table Created Successfully');
//       //     },
//       //     (txObj: any, error: any) => {
//       //       console.log('init', 'table', error);
//       //       console.log('Create table error', error);
//       //     };
//       // });
//     } else {
//       console.error('Database initialization failed.');
//     }
//   };
