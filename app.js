import express from "express";
import svg2png from "svg2png";
import redis from "redis";

// React Components
import React from "react";
import RDS from "react-dom/server";
import Avataaars from "./avataaars";

const { REDIS_URL } = process.env;

const app = express();
const client = redis.createClient({ url: REDIS_URL });

app.get("/", async (req, res) => {
  const key = JSON.stringify(req.query);
  client.get(key, async (image) => {
    if (!image) {
      const appString = RDS.renderToString(<Avataaars {...req.query} />);
      image = await svg2png(Buffer.from(appString, "utf8"));
      client.set(key, image);
    }
    res.writeHead(200, {
      "Content-Type": "image/png",
    });
    res.end(image);
  });
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

app.listen(process.env.PORT || 1234, () => {
  console.log(`start on http://localhost:${process.env.PORT || 1234}`);
});
