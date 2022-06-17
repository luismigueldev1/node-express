const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");
const path = require("path");
const fileUpload = require("express-fileupload");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.paths = {
      users: "/api/users",
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      search: "/api/search",
      uploads: "/api/uploads",
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

    // FileUpload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "../tmp",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.users, require("../routes/user"));
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.categories, require("../routes/categories"));
    this.app.use(this.paths.products, require("../routes/products"));
    this.app.use(this.paths.search, require("../routes/search"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
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
