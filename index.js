const express = require("express");
const path = require("path");
const compression = require("compression");
const app = express();
const morgan = require("morgan");
const log4js = require("log4js");
const logger = log4js.getLogger();
const fs = require("fs");

var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a"
});

var theHTTPLog = morgan({
  format: "default",
  stream: accessLogStream
});

app.use(theHTTPLog);
app.use(compression());
app.use(express.static(__dirname + "/dist/fedRamp/"));

const allowedExt = [
  ".js",
  ".ico",
  ".css",
  ".png",
  ".jpg",
  ".woff2",
  ".woff",
  ".ttf",
  ".svg"
];

app.get("/*", function(req, res) {
  if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
      if (!fs.existsSync(path.resolve(`dist/fedRamp/${req.url}`))) {
      return  res.sendStatus(404);
      }
      return res.sendFile(file);
  } else {
    res.sendFile(path.resolve("dist/fedRamp/index.html"));
  }
});

var listener = app.listen(process.env.PORT || 8000, "0.0.0.0", () => {
  console.log(`Node is running on localhost at port: 8000`);
});
