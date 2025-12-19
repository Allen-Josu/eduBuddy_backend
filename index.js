require("dotenv").config();

const express = require("express");

const servers = express();

const cors = require("cors");

const router = require("./router/router");

require("./database/database");
servers.use(express.json());
servers.use(
  cors({
    orgin: "http://localhost:4000",
  })
);

servers.use(router);

const port = 4000 || process.env;

servers.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
