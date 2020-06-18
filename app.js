import express from "express";
import svg2png from "svg2png";
// React Components
import React from "react";
import RDS from "react-dom/server";
import Avataaars from "./avataaars";

const app = express();

app.get("/", async (req, res) => {
  const appString = RDS.renderToString(<Avataaars {...req.query} />);
  const image = await svg2png(Buffer.from(appString, "utf8"));
  res.writeHead(200, {
    "Content-Type": "image/png",
  });
  res.end(image);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.end("error", {
      message: err.message,
      error: err,
    });
  });
}

module.exports = app;
