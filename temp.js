const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const { urlHasParam } = require("./utils");

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// category full url
// https://stackoverflow.com/questions/51510699/axios-recursion-for-paginating-an-api-with-a-cursor
// max data: 100 item

const getDataFromCategory = async (url) => {
  let pages = [0, 25, 50, 75]; // 25, 50, 75, 100

  const promises = pages.map(async (page, index) => {
    let newUrl = `${url}start=${page}`;
    const response2 = await axios(newUrl)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $(".product-box-container", html).each(function () {
          const title = $(this).find(".name").text().trim();
          const price = $(this).find("div.price").text();

          if (title) {
            console.log(title);
            /* prices.push({
              title,
              price,
              num_price: parseInt(price.replace(/\D/g, "")),
            }); */
            return {
              title,
              price,
              num_price: parseInt(price.replace(/\D/g, "")),
            };
          }
        });
      })
      .catch((err) => console.log(err));
    console.log(response2);
    return response2;
  });

  return await Promise.all(promises);
};

app.post("/category", (req, res) => {
  const url = urlHasParam(req.body.url);
  const results = getDataFromCategory(url);
  res.json({
    success: true,
    //count: prices.length,
    data: results,
  });
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
