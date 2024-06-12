const expres = require("express");
const router = expres.Router();
const { protectedRoute } = require("../middleware");
const {
  commPage,
  addToStalkList,
  deleteFromStalklist,
  getStalkList,
} = require("../controllers/community");

router.get("/", protectedRoute, commPage);
router.get("/stalklist", getStalkList);
router.post("/stalklist/add", addToStalkList);
router.post("/stalklist/remove", deleteFromStalklist);
// router.post("/stalklist/add", protectedRoute , addToStalkList);
// router.post("/stalklist/remove", protectedRoute,deleteFromStalklist);

module.exports = router;
