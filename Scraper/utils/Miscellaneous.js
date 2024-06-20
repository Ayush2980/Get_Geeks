module.exports = {
  getNumberFromString: (string) => {
    const regex = /\d+/;
    const match = string.match(regex);
    if (match) return parseInt(match[0]);
    else return undefined;
  },
  getDesignFromRating:(rating) => {
    const ratingToStars = [
        [1, "rgb(102,102,102)"],
        [2 , "rgb(30,125,34)"],
        [3 , "rgb(51,102,204)"],
        [4 , "rgb(104,66,115)"],
        [5 , "rgb(255,191,0)"],
        [6 , "rgb(255,127,0)"],
        [7 , "rgb(208,1,27)"],
    ];
    const numRating = parseInt(rating);
    const getHtml = (arr) => {
        let finalStr = "" , template = `<span style="background-color:${arr[1]}">★</span>`
        for(let i =0;i < arr[0]; i++) finalStr += template;
        return finalStr;
    }
    if(numRating < 1400) return getHtml(ratingToStars[0]);
    else if(numRating < 1600) return getHtml(ratingToStars[1]);
    else if(numRating < 1800) return getHtml(ratingToStars[2]);
    else if(numRating < 2000) return getHtml(ratingToStars[3]);
    else if(numRating < 2200) return getHtml(ratingToStars[4]);
    else if(numRating < 2500) return getHtml(ratingToStars[5]);
    else return getHtml(ratingToStars[6]);
  }
};
