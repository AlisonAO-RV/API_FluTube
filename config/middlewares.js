const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

module.exports = (app) => {
  app.use("/img", express.static("./asset/img"));
  app.use(bodyParser.json());
  app.use(fileUpload());
  app.use(cors());
};
