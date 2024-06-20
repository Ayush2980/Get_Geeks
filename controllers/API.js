const { getsvg } = require("../controllers/codeforces.js");
const {
  getNumberFromString,
  getDesignFromRating,
} = require("../utils/Miscellaneous.js");
const fetcher = require("../controllers/codechef.js");
const { default: axios } = require("axios");
module.exports.fetch = async (req, res) => {
  try {
    console.log("Hitt theroute ");
    const { username, handle } = req.query; //handle if null
    console.log(req.query);
    if (!username) throw new Error("Need a username for result !!!");
    if (handle === "CF") {
      const { data } = await axios.get(
        `https://codeforces.com/api/user.info?handles=${username}`
      );
      const contestData = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${username}`
      );
      //Change this to cross site
      const Svg = await getsvg(username);
      //Change above
      const contestArray = contestData.data.result;
      contestArray.forEach((e) => {
        e.changeInRating = e.newRating - e.oldRating;
      });
      contestArray.reverse();
      const { status, result } = data;
      if (!result[0].city) result[0].city = "";
      else result[0].city += " , ";
      result[0].username = username;
      if (!result[0].firstName) {
        result[0].firstName = "Codeforces";
        result[0].lastName = "User";
      }
      if (!result[0].country) {
        result[0].country = "Somewhere on earth";
        result[0].city = "";
      }
      if (status == "FAILED") throw new HandleError("User Not Found", 404);
      console.log({ ...result[0] });
      res.render("pages/findCF", {
        ...result[0],
        ...Svg,
        contestArray,
      });
    } else if (handle === "CC") {
      //cross site
      let userDataCC = await fetcher.searchCode(username);
      if (userDataCC == undefined) throw new HandleError("User Not Found", 404);
      userDataCC.maxRating = getNumberFromString(userDataCC.maxRating);
      userDataCC.maxRatingHtml = getDesignFromRating(userDataCC.maxRating);
      res.render("pages/findCC", { ...userDataCC });
    }
  } catch (e) {
    console.log(e.message);
    req.flash("error", e.message);
    res.redirect("/find");
  }
};

module.exports.justData = async (req, res) => {
  try {
    console.log("Hitt theroute ");
    const { username, handle } = req.query; //handle if null
    if (!username) throw new Error("Need a username for result !!!");
    if (handle === "CF") {
      const { data } = await axios.get(
        `https://codeforces.com/api/user.info?handles=${username}`
      );
      const contestData = await axios.get(
        `https://codeforces.com/api/user.rating?handle=${username}`
      );
      //cross site
      const Svg = await getsvg(username);
      const contestArray = contestData.data.result;
      contestArray.forEach((e) => {
        e.changeInRating = e.newRating - e.oldRating;
      });
      contestArray.reverse();
      const { status, result } = data;
      if (!result[0].city) result[0].city = "";
      else result[0].city += " , ";
      if (status == "FAILED") throw new HandleError("User Not Found", 404);
      res.send({ ...result[0], ...Svg, contestArray });
    } else if (handle === "CC") {
      //cross site
      let userDataCC = await fetcher.searchCode(username);
      if (userDataCC == undefined) throw new HandleError("User Not Found", 404);
      userDataCC.maxRating = getNumberFromString(userDataCC.maxRating);
      userDataCC.maxRatingHtml = getDesignFromRating(userDataCC.maxRating);
      res.send({ ...userDataCC });
    }
  } catch (e) {
    console.log(e.message);
    req.flash("error", e.message);
    res.send({ error: e.message });
  }
};
