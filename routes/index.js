var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var job = require('./../models/job');
const Job = mongoose.model('job');

/* GET home page. */
router.get('/', function(req, res, next) {
  Job.find().then(jobs => {
    res.render('index', {
      jobs: jobs
    });
  });
});

module.exports = router;
