import dotenv from "dotenv";
import { connectToDatabase } from './src/db/index.js';
import app from './src/server.js';

dotenv.config({
    path: './.env'
});

connectToDatabase();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
