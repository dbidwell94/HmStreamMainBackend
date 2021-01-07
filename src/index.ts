import { Connection } from "typeorm";
import app from "./app";
import connection from "./databaseConnection";

const PORT: number = Number(process.env.PORT || 2021);
export let CONNECTION: Connection = null;

connection
  .then((con) => {
    CONNECTION = con;
    Object.freeze(CONNECTION);
    app.listen(PORT);
  })
  .catch(console.error);
