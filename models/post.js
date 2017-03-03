var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    username: {
        type: String
    },
    
    title:{
        type:String,
        index: true
    },

    desc:{
        type:String,
        index: true
    },

    img: { 
        type: String
    }
});

var Post = module.exports = mongoose.model('portfolios', PostSchema);

module.exports.addWork = function(newPost, callback){
    newPost.save(callback); 
}

module.exports.getPostsByUsername = function(username, callback){
    var query = {username: username};
    Post.find(query, callback);
}
