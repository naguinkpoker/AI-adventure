import * as dotenv from "dotenv"
import path from "path"

dotenv.config({path: path.join(__dirname, "../../../", ".env")})

export default {
  CHAT_GPT_API_KEY: process.env.CHAT_GPT_API_KEY || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  DEEPL_TOKEN: process.env.DEEPL_TOKEN || ""
}
