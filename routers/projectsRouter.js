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

router.post('/', (req, res) => {
  Projects.insert(req.body)
    .then(newProject => {
      res.status(201).json(newProject);
    })
    .catch(err => { res.status(500).json({ errorMessage: "Something went wrong with your post" }) })
})


module.exports = router;


