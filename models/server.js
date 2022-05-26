const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const path = require("path");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.SERVER_PORT;
    this.paths = {
      usersRoutePath: "/api/users",
      authRoutePath: "/api/auth",
    };

    // Connect to DB
    this.dbConnect();

    // Middlewares
    this.middlewares();

    // Routes
    this.routes();
  }

  async dbConnect() {
    await dbConnection();
  }

  middlewares() {
    // Cors
    this.app.use(cors());

    // Body parser to json
    this.app.use(express.json());

    // Static Directory
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.usersRoutePath, require("../routes/user"));
    this.app.use(this.paths.authRoutePath, require("../routes/auth"));
  }

  listen() {
    this.app.get("/api*", (req, res) => {
      res.status(404).json({
        msg: "404 | NOT FOUND",
      });
    });

    this.app.get("*", (req, res) => {
      res.status(404).sendFile(path.join(__dirname, "../", "/public/404.html"));
    });

    this.app.listen(this.port, () => {
      console.log(`Server is starting on port: ${this.port}`);
    });
  }
}

module.exports = Server;
