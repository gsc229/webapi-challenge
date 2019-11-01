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

router.get('/:id', validateResId, (req, res) => {
  Projects.get(req.params.id)
    .then(proj => {
      if (!proj) {
        return res.status(404).json({ message: "There's no project matching that id in the database" })
      }
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

router.put('/:id', validateResId, (req, res) => {
  Projects.update(req.params.id, req.body)
    .then(updatedProj => {
      if (!updatedProj) { return res.status(404).json({ message: "There's no project matching that id in the database" }) }
      res.status(200).json(updatedProj);
    })
    .catch(err => res.status(500).json({ errorMessage: "Something went wrong with your update" }))

})

router.delete('/:id', validateResId, (req, res) => {
  Projects.remove(req.params.id)
    .then(info => res.status(200).json(info))
    .catch(err => res.status(500).json({ errorMessage: "Something went wrong trying to delete that project" }))
})


function validateResId(req, res, next) {
  const ResId = req.params.id;
  if (!ResId) {
    return res.status(400).json({ message: "You did not provide a project or action id in the url ie projects/1 ." })
  }
  if (isNaN(ResId)) {
    return res.status(400).json({ message: "Id's of projects and actions must be numbers" })
  }

  next();
}

module.exports = router;


