const express = require("express");
const router = express.Router();
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage").GridFsStorage;
const Grid = require("gridfs-stream");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

const User = require("../models/User");
const Document = require("../models/Document");

const mongoURI = process.env.mongoURI
const conn = mongoose.createConnection(
    mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
    () => console.log(`MongoDb Grid Connected`)
);
let gfs;
let filename = "";
conn.once("open", function () {
    // Init Stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("uploads");
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) return reject(err);
                const docName = `med-scans-${buf.toString("hex") + path.extname(file.originalname)
                    }`;

                const fileInfo = {
                    filename: docName,
                    bucketName: "uploads",
                };
                resolve(fileInfo);
            });
        });
    },
});
const uploadScans = multer({ storage }).single("scans");
const uploadReports = multer({ storage }).single("reports");

// @route   POST :/scans
// @desc    Upload Scans (png/jpeg)
// @access  Private
router.post("/scans", auth, (req, res) => {
    uploadScans(req, res, async (err) => {
        if (err) {
            return res.json({ success: false, err, upload: "scans" });
        } else {
            let user = await User.findOne({ _id: req.user.id }).select('-password')
            let document = new Document({
                docType: 'scans', filename: res.req.file.filename, User: req.user.id
            })
            await document.save()
            user.Document.push(document.id)
            await user.save()
            return res.status(201).json({
                document
            });
        }
    });
});


// @route   POST :/thumbnail
// @desc    Upload Thumbnail
// @access  Private
router.post("/reports", auth, async (req, res) => {
    uploadReports(req, res, async (err) => {
        if (err) {
            return res.json({ success: false, err, upload: "reports" });
        } else {
            console.log(`Scan Name ${res.req.file.filename}`);
            let user = await User.findOne({ _id: req.user.id }).select('-password')

            let document = new Document({
                docType: 'reports', filename: res.req.file.filename, User: req.user.id
            })
            await document.save()
            user.Document.push(document.id)
            await user.save()
            return res.status(201).json({
                document
            });
        }
    });
});

// @route   GET :/scans
// @desc    Get Scans as Images
// @access  Private (Only Authorised Doctors and the User himself)
router.get("/scans/:filename", auth, async (req, res) => {
    // TODO: Verifying Document to Access by Docter
    const data = await Document.findOne({ filename: req.params.filename });
    if (data.User == req.user.id) {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            if (!file || file.length === 0)
                return res.status(404).json({ err: "No file exists" });
            if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
                const readstream = gfs.createReadStream(file.filename);
                readstream.pipe(res);
            } else {
                res.status(404).json({ err: "Not an image" });
            }
        });
    }

});

// @route   GET :/reports
// @desc    Download Reports 
// @access  Private (Only Authorised Doctors and the User himself)
router.get("/reports/:filename", auth, async (req, res) => {
    const data = await Document.findOne({ filename: req.params.filename })
    if (data.User == req.user.id) {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            if (!file || file.length === 0)
                return res.status(404).json({ err: "No file exists" });
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        });
    }
    else {
        return res.json({ message: "Not Authorized" })
    }

});

// @route   GET /scans
// @desc    Get all the scans for User 
// @access  Private (Only Authorised by the User)
router.get("/allScans", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("Document")
        let scans = user.Document.filter((data) => data.docType == "scans")
        return res.json(scans)
    } catch (error) {
        return res.status(400).json({ success: false })
    }
});

// @route   GET /scans
// @desc    Get all the scans for User 
// @access  Private (Only Authorised by the User)
router.get("/allReports", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("Document")
        let reports = user.Document.filter((data) => data.docType == "reports")
        return res.json(reports)
    } catch (error) {
        return res.status(400).json({ success: false })
    }
});
module.exports = router
