import app from "./app";
import { env } from "@trello-clone/env/server";

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});