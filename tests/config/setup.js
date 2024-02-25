const dotenv = require("dotenv");
const path = require("path");

dotenv.configDotenv({ path: path.resolve(__dirname, "../../.env.test") });
