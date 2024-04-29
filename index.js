const express = require("express");
const cors = require("cors");
const blogRouter = require("./route/blog-route");
const PORT = process.env.PORT || 5000

require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/blogs", blogRouter);

app.use("/api", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => console.log(`app is running at ${PORT}`));