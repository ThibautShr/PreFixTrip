"use strict";

var express = require("express");
var controller = require("./users.controller");
var config = require("../../config/environment");
var auth = require("../../auth/auth.service");

var router = express.Router();

router.get("/", auth.hasRole("admin"), controller.index);
router.get("/search", auth.isAuthenticated(), controller.search);
router.delete("/:id", auth.hasRole("admin"), controller.destroy);
router.get("/me", auth.isAuthenticated(), controller.me);
router.put("/:id", auth.isAuthenticated(), controller.updateUser);
router.get("/pseudo/:pseudo", controller.showByPseudo);
router.get("/:id", auth.isAuthenticated(), controller.show);
router.post("/", controller.create);

module.exports = router;
