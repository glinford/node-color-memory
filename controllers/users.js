var mongoose = require('mongoose');
var Users = mongoose.model('Users');

exports.findAll = function(req, res) {
    Users.find({},function(err, results) {
        return res.send(results);
    });
};

exports.findById = function(req, res) {
    Users.findOne({'_id': req.params.id}, function(err, result){
        return res.send(result);
    });
};

exports.add = function(req, res) {
    Users.create({
        "username": req.body.username,
        "email": req.body.email,
        "score": req.body.score,
        "tries":req.body.tries,
        "time":req.body.time
    }, function (err) {
        if (err) {
            return console.log(err);
        }
        return res.sendStatus(202);
    });
};

exports.update = function(req, res) {
    Users.update({"_id" : req.params.id}, req.body, function (err) {
        if (err){
            return console.log(err);
        }
        res.sendStatus(202);
    });
};

exports.delete = function(req, res) {
    Users.remove({'_id': req.params.id},function(result) {
        return res.send(result);
    });
};

exports.findHighscores = function(req, res) {
    Users.find({}).limit(10).sort('-score').exec(function(err, results){
        return res.send(results);
    });
}

exports.getStats = function(req, res) {
    Users.find({}, function(err, results){
    var global_count = 0;
    var time_count = 0;
    var score_count = 0;
    var data_value = {};
    results.forEach(function(element, index){
        global_count++;
        if(element.time > req.body.time){
           time_count++;
        }
        if (element.score > req.body.score){
            score_count++;
        }
    });
    data_value.rank = global_count - (global_count - score_count - 1);
    data_value.timestat = (global_count == 0) ? 0 : (time_count * 100) / global_count;
    console.log(JSON.stringify(data_value));
    return res.send(JSON.stringify(data_value));
    });
}
