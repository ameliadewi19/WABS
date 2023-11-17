const express= require("express");
const {verifyToken} = require("../middleware/VerifyToken.js");
const multer = require('multer'); 
const {
    getRecipient, 
    getRecipientById,
    createRecipient1,
    createRecipient,
    updateRecipient,
    // deleteRecipient,
    downloadExcelTemplate
} = require("../controllers/RecipientController.js");

const router = express.Router();

// Set up multer for file uploads
const storage = multer.memoryStorage(); // Store the uploaded file in memory
const upload = multer({ storage });

router.get('/recipient',getRecipient);
router.get('/recipient/:id',getRecipientById);
router.get('/recipient/download-template', downloadExcelTemplate)
router.post('/recipient', upload.single('excelFile'),createRecipient);
router.post('/recipient1',createRecipient1);
//router.post('/recipient', createBulkRecipient);
router.patch('/recipient/:id', updateRecipient);
// router.delete('/recipient/:id', deleteRecipient);

module.exports = router;