const router = require("express").Router();
const userController = require("../controllers/userController");
const jokeController = require("../controllers/jokeController");
const { authenticate, authorization } = require('../middlewares/verify')

router.get("/randomJoke", jokeController.getRandomJoke)

router.post("/favorites", authenticate, userController.favorite)

router.delete("/favorites/:id", authenticate, authorization, userController.unfavorite)

router.get("/verify", userController.verify)

router.get("/", userController.findAll);

router.get("/user", authenticate, userController.find);

router.post("/register", userController.create);

router.post("/login", userController.login);

module.exports = router;