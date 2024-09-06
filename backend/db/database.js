import { createPool} from "mysql2/promise"
import { DB_HOST,DB_NAME,DB_PASSWORD,DB_USER} from "../config/config.js"
export const createMyPool =()=>{
    try {
        const newPool = createPool({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_NAME,
        })
        return newPool;
    } catch (error) {
        console.log(error)
    }
} 

export const pool = createMyPool();