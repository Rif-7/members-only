var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/sign-up", userController.sign_up_get);
router.post("/sign-up", userController.sign_up_post);

router.get("/login", userController.login_get);
router.post("/login", userController.login_post);

router.get("/logout", userController.logout);

router.get("/membership", userController.membership_get);
router.post("/membership", userController.membership_post);

module.exports = router;
