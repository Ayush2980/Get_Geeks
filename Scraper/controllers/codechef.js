const puppeteer = require("puppeteer-core");
const { LaunchScrapper } = require("../Launch");

module.exports = {
  //used
  searchCode: async (req, res) => {
    const { user } = req.params;
    const page = await LaunchScrapper(`https://www.codechef.com/users/${user}`);
    const url = page.url();
    if (url == "https://www.codechef.com/")
      return new Error("No such exists !!");

    let dataObj = {};
    //Search for userDetails
    dataObj = {
      username: ".m-username--link",
      country: ".user-country-name",
      ratingNo: ".rating-number",
      ratingStar: ".rating",
      maxRating: ".rating-header small",
      globalRank: ".rating-ranks ul li:nth-child(1) a strong",
      countryRank: ".rating-ranks ul li:nth-child(2) a strong",
      ratingGraph: "#cumulative-graph",
      currRatingHtml: ".rating-star",
      // heatmapSvg: "#submissions-graph",
      heatmapSvg: "#js-heatmap",
    };
    let i = 1;
    for (const key in dataObj) {
      console.log(i++);
      const data = await page.waitForSelector(dataObj[key]);
      dataObj[`${key}`] = await data.evaluate((e) => {
        return e.innerHTML;
      });
    }
    let images = {
      dp: ".profileImage",
      flag: ".user-country-flag",
    };
    for (const key in images) {
      const data = await page.waitForSelector(images[key]);
      images[`${key}`] = await data.evaluate((e) => {
        return e.src;
      });
    }
    const returnObj = { ...dataObj, ...images };
    res.send({ success: true, result: returnObj });
  },
};
