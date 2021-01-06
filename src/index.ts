import app from "./app";
import connection from "./databaseConnection";

const PORT: number = Number(process.env.PORT || 2021);

connection.then(() => app.listen(PORT)).catch(console.error);
