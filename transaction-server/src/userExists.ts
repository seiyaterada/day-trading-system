import {connectToDatabase} from "../db/connection";


export const userExists = async (username: string) => {
    const db = await connectToDatabase();
    if(!db) { 
        // res.send("Error: Database connection failed").status(500);
        return false;
      }
    let users = await db.collection("USERS");
    if(await users.findOne({ username: username })) {
        return true;
    } else {
        return false;
    }
}