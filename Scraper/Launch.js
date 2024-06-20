const puppeteer = require("puppeteer");
require("dotenv").config();
const { PUPPETEER_EXECUTABLE_PATH, NODE_ENV } = process.env;

module.exports = {
  LaunchScrapper: async (websiteUrl) => {
    try {
      const browser = await puppeteer.launch({
        args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote",
        ],
        executablePath:
          NODE_ENV === "production"
            ? PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
      });
      // DEVELOPMENT MODE BROWSER OPENER :
      //   const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(websiteUrl);
      return page;
    } catch (e) {
      throw Error(e.message);
    }
  },
};
