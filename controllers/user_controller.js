var address_controller = require('./address_controller');
module.exports = {
    add_user: function (username, email, phone_number, address_id, password,callback) {
        address = address_controller.get_address(address_id, function(err, result){
            var MongoClient = require('mongodb').MongoClient;
            var url = "mongodb://localhost:27017/";
            var user={
                username: username,
                email: email,
                phone_number: phone_number,
                address: result,
                password: password
            };

            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                var dbo = db.db("online_testing");
                dbo.collection("users").insertOne(user, function (err, res) {
                    if (err) throw err;
                    db.close();
                    callback(false, true)
                });
            });
        })
    }
};
