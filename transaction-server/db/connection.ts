import { MongoClient } from "mongodb";

const connectionString = "mongodb://DBContainer:27017";


const connectToDatabase = async () => {
  const client = new MongoClient(connectionString);
  let conn;
  try {
    conn = await client.connect();
    } catch(e) {
    console.error(e);
  }
  let db;
  if(conn) {
    db = conn.db("users");
  } else {
    console.error("Connection failed");
  }
  return db;
}


export { connectToDatabase };