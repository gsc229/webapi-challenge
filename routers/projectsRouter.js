const express = require('express');
const router = express.Router();
const Projects = require('../data/helpers/projectModel');


router.get('/', (req, res) => {
  Projects.get()
    .then(projs => {
      console.log("Projects router: projs", projs);
      res.status(200).json(projs);
    })

})


module.exports = router;


