const express = require('express');
const { getUserListController } = require('../controllers/user.controller');

const router = express.Router();

router.get('/' , getUserListController)

module.exports = {
    router
}
