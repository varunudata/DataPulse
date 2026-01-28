import mysql from "mysql2/promise";

let pool = null;
let connectedDatabase = null;
let cachedSchemaText = null;

export const connectToDB = async (config) => {
  const newPool = mysql.createPool(config);
  try {
    const conn = await newPool.getConnection();
    conn.release();

    // Connection successful, switch to new pool
    if (pool) {
      await pool.end();
    }
    pool = newPool;
    connectedDatabase = config.database;
    cachedSchemaText = null;
    return true;
  } catch (error) {
    await newPool.end(); // Cleanup the failed pool
    throw error; // Re-throw to be caught by controller
  }
};

export const getPool = () => pool;
export const getConnectedDb = () => connectedDatabase;

export const loadSchema = async () => {
  if (cachedSchemaText) {
    return cachedSchemaText;
  }
  const [tables] = await pool.query(
    `select TABLE_NAME from INFORMATION_SCHEMA.tables where TABLE_SCHEMA = ?`,
    [connectedDatabase]
  );
  let schema = "";
  for (const t of tables) {
    const name = t.TABLE_NAME;
    const [cols] = await pool.query(
      `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_KEY 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA=? AND TABLE_NAME=?`,
      [connectedDatabase, name]
    );
    schema += `Table: ${name}\n`;
    schema += cols
      .map(
        (c) =>
          `${c.COLUMN_NAME} ${c.COLUMN_TYPE} ${c.IS_NULLABLE} ${c.COLUMN_KEY}`
      )
      .join("\n");
    schema += "\n\n";
  }
  cachedSchemaText = schema;
  return schema;
};
