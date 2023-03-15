import express from "express";
import cors from "cors";
import db from "../db/connection.mjs";
// import routes from "./routes.mjs";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.post('/add', async (req, res) => {
  const userId = 'test'
  let collection = await db.collection(userId);
  let results = await collection.insertOne({userId: userId, amount: 1000});
  res.send(results).status(200);
});

// Load the /posts routes
// app.use("/", routes);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});