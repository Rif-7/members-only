var express = require("express");
var router = express.Router();

const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

/* GET home page. */
router.get("/", postController.post_list);

router.get("/sign-up", userController.sign_up_get);
router.post("/sign-up", userController.sign_up_post);

router.get("/login", userController.login_get);
router.post("/login", userController.login_post);

router.get("/logout", userController.logout);

router.get("/membership", userController.membership_get);
router.post("/membership", userController.membership_post);

router.get("/admin", userController.admin_get);
router.post("/admin", userController.admin_post);

router.get("/new-post", postController.new_post_get);
router.post("/new-post", postController.new_post_post);

router.get("/delete/:id", postController.delete_post);

module.exports = router;
