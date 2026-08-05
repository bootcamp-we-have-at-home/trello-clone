import { pool } from "./config/database";

async function testDB() {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("Database connected:", result.rows);
    } catch (error) {
        console.error("Database error:", error);
    } finally {
        await pool.end();
    }
}

testDB();