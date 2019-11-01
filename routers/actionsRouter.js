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
  Actions.insert(req.body)
    .then(newAction => {
      res.status(201).json(newAction);
    })
    .catch(err => { res.status(500).json({ errorMessage: "Something went wrong with your post" }) })
})

router.put('/:id', (req, res) => {
  Actions.update(req.body.id, req.body)
    .then(updatedProj => {
      res.status(200).json(updatedProj);
    })
    .catch(err => res.status(500).json({ errorMessage: "Something went wrong with your update" }))

})

router.delete('/:id', (req, res) => {
  Actions.remove(req.params.id)
    .then(info => res.status(200).json(info))
    .catch(err => res.status(500).json({ errorMessage: "Something went wrong trying to delete that project" }))
})





module.exports = router;
