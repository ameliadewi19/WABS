const express= require("express");
const {verifyToken} = require("../middleware/VerifyToken.js");
const multer = require('multer'); 
const {
    getRecipient, 
    getRecipientById,
    createRecipient1,
    createRecipient,
    updateRecipient,
    deleteRecipient,
    downloadExcelTemplate
} = require("../controllers/RecipientController.js");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store the uploaded file in memory
const upload = multer({ storage });

router.get('/recipient',verifyToken, getRecipient);
router.get('/recipient/:id', verifyToken,getRecipientById);
router.get('/recipient/download-template', downloadExcelTemplate)
router.post('/recipient', upload.single('excelFile'), verifyToken,createRecipient);
router.post('/recipient1',verifyToken, createRecipient1);
//router.post('/recipient', createBulkRecipient);
router.patch('/recipient/:id', verifyToken,updateRecipient);
router.delete('/recipient/:id',verifyToken, deleteRecipient);

module.exports = router;