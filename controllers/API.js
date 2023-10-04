module.exports.fetch = async(req , res) => {
    if(req.query.handle === "CF"){
      const userData = await helper.searchCF(req.query.search);
      if(userData == undefined) throw new HandleError("User Not Found",404);
      res.locals.image_stalk = userData.userImage;
      res.render('pages/findCF' , {userData});
    }
    else if(req.query.handle === "CC"){
      const userDataCC = await fetcher.searchCode(req.query.search);
      if(userDataCC == undefined) throw new HandleError("User Not Found",404);
      res.render('pages/findCC' , {userDataCC});
    }
}