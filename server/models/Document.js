const mongoose = require("mongoose");
const DocumentSchema = new mongoose.Schema({
    title: {
        type: String
    },
    filename: {
        type: String
    },
    docType: {
        type: String,
        enum: ['scans', 'reports']
    },
    date: {
        type: Date,
        default: Date.now
    },
    public: {
        type: Boolean,
        default: false
    },
    doctors: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }
    ],
    User: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = Document = mongoose.model("Document", DocumentSchema);
