const express = require('express');
const multer = require('multer');
// const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const app = express();


app.use(express.static(path.resolve("./public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Upload.html'));
});


// Configure AWS SDK for S3
// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION
// });
// const s3 = new AWS.S3();

// Configure multer for file handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Temporary storage on the server
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });










// Upload end point
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const fileContent = fs.readFileSync(req.file.path);

        // Set up S3 upload parameters
        // const params = {
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: `uploads/${req.file.filename}`, // File name in the bucket
        //     Body: fileContent,
        //     ContentType: req.file.mimetype
        // };

        // Uploading to S3
        // const data = await s3.upload(params).promise();

        // Remove the file from server storage after upload
        fs.unlinkSync(req.file.path);

        res.status(200).json({ message: 'File uploaded successfully', fileContent});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'File upload failed', error: error.message });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});

