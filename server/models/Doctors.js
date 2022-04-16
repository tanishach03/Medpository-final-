const mongoose = require("mongoose");
const DoctorSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    data: {
        type: Date,
        default: Date.now,
    },
    patients: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    ],
    documents: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Document' }
    ]
});
module.exports = Doctor = mongoose.model("Doctor", DoctorSchema);
