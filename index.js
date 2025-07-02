const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var cookieParser = require("cookie-parser");
const router = require("./router");
const client = require("./connectDb");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const port = 3000 || process.env.PORT;

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(router);

client
  .connect()
  .then(() => {
    console.log("database connected");
    app.listen(port, () => {
      console.log(`server listening on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log("database error"));
