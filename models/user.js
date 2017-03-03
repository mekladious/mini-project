var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// User schema 

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: {unique: true}
    },

    email:{
        type: String
    },

    password:{
        type: String
    },

    name:{
        type: String
    },

    profileimg: { 
        type: String
    }
    });

var User = module.exports = mongoose.model('users', UserSchema);

module.exports.createUser = function(newUser, callback){

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password=hash;
            newUser.save(callback); 
        });
    });
}

module.exports.getUserByUsername= function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById= function(id, callback){
    User.findById(id, callback);
}

module.exports.comparePassword= function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports.addProfilePic= function(user, img, callback){
    var query = {_id: user._id};
    User.findOneAndUpdate(query, {profileimg: img}, callback);
} 
