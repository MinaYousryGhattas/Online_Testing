var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var topic = require('./../models/topic');
const Topic = mongoose.model('topic');

router.get('/',(req, res)=>{
    Topic.find().populate('question').then(topics=>{
        res.render('topic/show_topics',{
            topics: topics
        })
    })
});
router.get('/view_topic/:id',(req,res)=>{
    Topic.findOne({
        _id: req.params.id
    }).populate('question').then(topic =>{
        res.render('topic/view_topic',{
            topic: topic
        })
    })
});

module.exports = router;