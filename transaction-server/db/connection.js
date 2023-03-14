import { MongoClient } from "mongodb";

const connectionString = "mongodb://DBContainer";

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
  } catch(e) {
  console.error(e);
}

let db = conn.db("users");

export default db;