import { env } from "@trello-clone/env/server";
import app from "./app.js";

app.listen(env.PORT, () => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});