import { createPool } from "mysql2/promise";
import { DB_HOST, DB_PASSWORD, DB_USER, DB_DATABASE } from "./config.js";
const createMyPool = async (req, res) => {
  const pool = createPool({
    host: "localhost",
    user: "root",
    password: "1234",
  });
  return pool;
};
export const conn = await createMyPool();
