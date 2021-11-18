const PORT = 8000;
const express = require("express");

const { urlHasParam } = require("./utils");
const { getDataFromCategory } = require("./functions");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.post("/category", (req, res) => {
  const plainUrl = req.body.url;
  const url = urlHasParam(plainUrl);

  getDataFromCategory(url).then((response) => {
    const newArray = [];
    response.map((arr) => arr.map((obj) => newArray.push(obj)));

    res.json({
      success: true,
      count: newArray.length,
      url: plainUrl,
      data: newArray,
    });
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
