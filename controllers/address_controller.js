// var address_controller = require('./address_controller')
module.exports = {
    get_address: function (address_name,callback) {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        var address
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("online_testing");
            dbo.collection("address").findOne({address: address_name}, function (err, result) {
                if (err) throw err;
                db.close();
                callback(false, result)
            });
        });
    }
};