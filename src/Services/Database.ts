import {
  SQLiteDatabase,
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';
import {
  IHistoryDataCorrection,
  IUserDetails,
} from '../Components/HistoryDataCorrectionModel';

// Enable promise for SQLite
enablePromise(true);

export const connectToDatabase = async () => {
  return openDatabase(
    {name: 'yourProjectName.db', location: 'default'},
    () => {},
    error => {
      console.error(error);
      throw Error('Could not connect to database');
    },
  );
};
export const createTables = async (db: SQLiteDatabase) => {
  const userPreferencesQuery = `
      CREATE TABLE IF NOT EXISTS UserPreferences (
          id INTEGER DEFAULT 1,
          colorPreference TEXT,
          languagePreference TEXT,
          PRIMARY KEY(id)
      )
    `;
  const contactsQuery = `
     CREATE TABLE IF NOT EXISTS Contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        name TEXT,
        phoneNumber TEXT
     )
    `;
  const UserDetails = `CREATE TABLE IF NOT EXISTS UserDetails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
     Name TEXT,
      UserName TEXT,
      Profilepic BLOB)`;
  const historyDataCorrection = `CREATE TABLE IF NOT EXISTS trtHistoryDataCorrections(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        TIMESTAMP TEXT NULL,
        VALUE REAL NULL,
        HISTORY_ID TEXT NULL,
        STATUS_TAG TEXT NULL,
        CorrectedValue REAL NULL
      )`;
  try {
    await db.executeSql(userPreferencesQuery);
    await db.executeSql(contactsQuery);
    await db.executeSql(UserDetails);
    await db.executeSql(historyDataCorrection);
  } catch (error) {
    console.error(error);
    throw Error(`Failed to create tables`);
  }
};
export const addDetails = async (db: SQLiteDatabase, Param: any) => {
  const insertQuery = `
     INSERT INTO UserDetails (Name, UserName, Profilepic)
     VALUES (?, ?, ?)
   `;
  const values = [Param.Name, Param.UserName, [Param.Profilepic]];
  try {
    return db.executeSql(insertQuery, values);
    //console.log('table created');
  } catch (error) {
    console.error(error);
    throw Error('Failed to add details');
  }
};
export const addcorrectionDetails = async (db: SQLiteDatabase, Param: any) => {
  const insertQuery = `
     INSERT INTO trtHistoryDataCorrections (TIMESTAMP, VALUE, HISTORY_ID,STATUS_TAG,CorrectedValue)
     VALUES (?, ?, ?,?,?)
   `;
  const values = [
    Param.timeStamp,
    Param.value,
    Param.historyId,
    Param.statusTags,
    Param.value,
  ];
  try {
    return db.executeSql(insertQuery, values);
    //console.log('table created');
  } catch (error) {
    console.error(error);
    throw Error('Failed to add details');
  }
};
export const getDetails = async (db: SQLiteDatabase) => {
  try {
    const contacts: IUserDetails[] = [];
    const results = await db.executeSql('SELECT * FROM UserDetails');
    results?.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        contacts.push(result.rows.item(index));
      }
    });
    return contacts;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Contacts from database');
  }
};
export const getCorrectionDetails = async (db: SQLiteDatabase) => {
  try {
    const contacts: IHistoryDataCorrection[] = [];
    const results = await db.executeSql(
      'SELECT * FROM trtHistoryDataCorrections',
    );
    results?.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        contacts.push(result.rows.item(index));
        console.log('Data', contacts);
      }
    });
    return contacts;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get Contacts from database');
  }
};
