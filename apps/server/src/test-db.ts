import { db } from "@trello-clone/db";

async function testDatabase() {
    try {
        const result = await db.query("SELECT NOW()");
        console.log("Database connected:", result.rows);
    } catch (error) {
        console.error("Database error:", error);
    } finally {
        await db.end();
    }
}

testDatabase();