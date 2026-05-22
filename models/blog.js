const { Schema, model } = require('mongoose');

const blogSchema = new Schema ({
    title: {
        type: String, 
        tequired: true,
    },
    body: {
        type: String, 
        tequired: true,
    },
    coverImageUrl: {
        type: String,
        required:false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

}, {timestamps: true});

module.exports = model('Blog', blogSchema);