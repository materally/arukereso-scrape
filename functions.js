const axios = require("axios");
const cheerio = require("cheerio");

async function getDataFromCategory(url) {
  let pages = [0, 25, 50, 75];

  const promises = pages.map((page) => {
    let newUrl = `${url}start=${page}`;
    return axios(newUrl)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const prices = [];

        $(".product-box-container", html).each(function () {
          const title = $(this).find(".name").text().trim();
          const price = $(this).find("div.price").text();

          if (title) {
            prices.push({
              product_title: title,
              price_text: price,
              price_number: parseInt(price.replace(/\D/g, "")),
            });
          }
        });

        return prices;
      })
      .catch((err) => console.log(err));
  });

  return await Promise.all(promises);
}

module.exports = {
  getDataFromCategory,
};
