import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'queen-bean',
};

// Create a connection pool to handle multiple concurrent requests efficiently
export const pool = mysql.createPool(dbConfig);

/**
 * Execute a query with provided values
 */
export async function query<T>(sql: string, values?: any[]): Promise<T> {
  const [results] = await pool.execute(sql, values);
  return results as T;
}
