const puppeteer = require("puppeteer-core");

module.exports = {
  searchCF: async (user) => {
    console.log("starting !!!");
    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    });
    const page = await browser.newPage();

    await page.goto(`https://codeforces.com/profile/${user}`);
    const url = await page.url();
    console.log(url);
    if (url == "https://codeforces.com/") return undefined;
    console.log("creating");
    var dataObj = {
      username: ".main-info > h1 > a",
      userRank: ".main-info div:nth-child(1)",
      userRating: ".info ul > li > span",
      userMaxRank: ".info ul > li span:nth-child(3) span:nth-child(1)",
      userMaxRating: ".info ul > li span:nth-child(3) span:nth-child(2)",
      userContribution: ".info ul li:nth-child(2) > span",
      problemsTotal: "._UserActivityFrame_footer > div div:nth-child(1) > div",
      problemsLastYear:
        "._UserActivityFrame_footer > div div:nth-child(2) > div",
      problemsLastMonth:
        "._UserActivityFrame_footer > div div:nth-child(3) > div",
      lastOnline: ".info ul li:nth-child(4) > span",
      registered: ".info ul li:nth-child(5) > span",
      userImage: ".title-photo > div > div > div > img",
    };
    // await page.screenshot({ path: "imn.png" });
    for (const keys in dataObj) {
      if (keys === "userFullName") {
        try {
          const data = await page.waitForSelector(dataObj[keys]);
          const data2 = await data.evaluate((e) => {
            return e.innerText;
          });
          const name = data2.slice(0, data2.indexOf(","));
          const location = data2.slice(data2.indexOf(",") + 2, data2.length);
          dataObj[keys] = name;
          dataObj["userLocation"] = location;
        } catch (e) {
          dataObj[keys] = "Coder N";
          dataObj["userLocation"] = "Somewhere on Earth !!!";
        }
      } else if (keys === "userImage") {
        const data = await page.waitForSelector(dataObj[keys]);
        dataObj[keys] = await data.evaluate((e) => {
          return e.src;
        });
      } else {
        try {
          const data = await page.waitForSelector(dataObj[keys]);
          dataObj[keys] = await data.evaluate((e) => {
            return e.innerText;
          });
        } catch (e) {
          dataObj[keys] = "No Data";
        }
      }
    }

    await browser.close();
    console.log(dataObj);
    return dataObj;
  },
  getsvg: async (user) => {
    console.log("get svg");
    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    });
    const page = await browser.newPage();

    await page.goto(`https://codeforces.com/profile/${user}`);

    const data = await page.waitForSelector("#userActivityGraph");
    const data2 = await data.evaluate((e) => {
      console.log("got it");
      return e.innerHTML;
    });
    let onlineData = {
      lastOnline: ".info ul li:nth-child(4) span",
      registered: ".info ul li:nth-child(5) span",
    };
    for (const keys in onlineData) {
      const val = await page.waitForSelector(onlineData[keys]);
      onlineData[keys] = await val.evaluate((e) => {
        return e.innerText;
      });
    }
    console.log("Time Nodes ");
    console.log(onlineData);
    return { data2, ...onlineData };
  },
  fetchForProf: async (user) => {
    console.log("Fetch cf");
    const browser = await puppeteer.launch({
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    });
    const page = await browser.newPage();

    await page.goto(`https://codeforces.com/profile/${user}`);
    var dataObj = {
      username: ".main-info > h1 > a",
      userRank: ".main-info div:nth-child(1)",
      userRating: ".info ul > li > span",
      userMaxRank: ".info ul > li span:nth-child(3) span:nth-child(1)",
      userMaxRating: ".info ul > li span:nth-child(3) span:nth-child(2)",
      userImage: ".title-photo > div > div > div > img",
    };
    for (const keys in dataObj) {
      if (keys === "userImage") {
        const data = await page.waitForSelector(dataObj[keys]);
        dataObj[keys] = await data.evaluate((e) => {
          return e.src;
        });
      } else {
        try {
          const data = await page.waitForSelector(dataObj[keys]);
          dataObj[keys] = await data.evaluate((e) => {
            return e.innerText;
          });
        } catch (e) {
          dataObj[keys] = "No Data";
        }
      }
    }

    await browser.close();
    console.log(dataObj);
    return dataObj;
    
  },
};
