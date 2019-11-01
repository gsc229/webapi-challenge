const express = require('express');
const router = express.Router();
const Actions = require("../data/helpers/actionModel");



router.get('/', (req, res) => {
  Actions.get()
    .then(actns => {
      console.log("Actions router, .get actns", actns);
      res.status(200).json(actns);
    })
})


router.post('/', (req, res) => {
  const projId = req.body.project_id;
  if (!projId) { return status(400).json({ errorMessage: "There's no post id for this action" }) }
  Actions.insert(req.body)
    .then(newAction => {
      res.status(201).json(newAction);
    })
    .catch(err => { res.status(500).json({ errorMessage: "Something went wrong with your post" }) })
})

router.put('/:id', validateResId, (req, res) => {
  Actions.update(req.params.id, req.body)
    .then(updatedProj => {
      res.status(200).json(updatedProj);
    })
    .catch(err => res.status(500).json({ errorMessage: "Something went wrong with your update" }))

})

router.delete('/:id', validateResId, (req, res) => {
  Actions.remove(req.params.id)
    .then(info => res.status(200).json(info))
    .catch(err => res.status(500).json({ errorMessage: "Something went wrong trying to delete that project" }))
})

function validateResId(req, res, next) {
  console.log("validateResId middleware");
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
