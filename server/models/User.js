const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    Document: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Document'
    }],
    // doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }],
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    profileImage: {
        type: String,
        default:
            "https://floating-springs-68584.herokuapp.com/api/profile/image/profile.png",
    },
    bloodRate: {
        type: Number,
    },
    height: {
        type: Number,
    },
    weight: {
        type: Number,
    },
    eyeHealth: {
        type: String,
    },
    teethHeath: {
        type: String,
    },
    mentalHeath: {
        type: String,
    },
    smoke: {
        type: Boolean
    },
    alcohol: {
        type: Boolean
    }

});
module.exports = User = mongoose.model("user", UserSchema);
