const express = require('express');
const router = express.Router();
const {
  createColor,
  getColor,
  deleteColor
} = require('../controller/colorController');

router.post('/', createColor);
router.get('/', getColor);
router.delete('/:id', deleteColor);

module.exports = router;