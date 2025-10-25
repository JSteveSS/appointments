import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.RDS_HOST!,
  port: Number(process.env.RDS_PORT || 3306),
  user: process.env.RDS_USER!,
  password: process.env.RDS_PASSWORD!,
  database: process.env.RDS_DATABASE!,
});
