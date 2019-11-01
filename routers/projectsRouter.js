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

router.get('/:id', (req, res) => {
  Projects.get(req.params.id)
    .then(proj => {
      console.log("Projects router: projs", proj);
      res.status(200).json(proj);
    })

})

router.post('/', (req, res) => {
  Projects.insert(req.body)
    .then(newProject => {
      res.status(201).json(newProject);
    })
    .catch(err => { res.status(500).json({ errorMessage: "Something went wrong with your post" }) })
})

router.put('/:id', (req, res) => {
  Projects.update(req.body.id, req.body)
    .then(updatedProj => {
      res.status(200).json(updatedProj);
    })
    .catch(err => res.status(500).json({ errorMessage: "Something went wrong with your update" }))

})

router.delete('/:id', (req, res) => {
  Projects.remove(req.params.id)
    .then(info => res.status(200).json(info))
    .catch(err => res.status(500).json({ errorMessage: "Something went wrong trying to delete that project" }))
})



module.exports = router;


