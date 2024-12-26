const express = require('express');
const { uploadHTMLToArDrive, uploadPDFToArDrive } = require('../ardrive/index');
const multer = require('multer');

const arDriverouter = express.Router();
const upload = multer(); 

arDriverouter.post('/upload-html', async (req, res) => {
    try {
        const { walletPath, htmlContent, destFolderId, driveKey } = req.body;

        if (!walletPath || !htmlContent || !destFolderId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await uploadHTMLToArDrive(walletPath, htmlContent, destFolderId, driveKey);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('Error uploading HTML to ArDrive:', error);
        res.status(500).json({ error: 'Failed to upload HTML to ArDrive' });
    }
});

arDriverouter.post('/upload-pdf', upload.single('pdfFile'), async (req, res) => {
    try {
        const { walletPath, destFolderId, driveKey } = req.body;

        if (!walletPath || !destFolderId || !req.file) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const pdfBuffer = req.file.buffer;
        const result = await uploadPDFToArDrive(walletPath, pdfBuffer, destFolderId, driveKey);
        res.status(200).json({ success: true, result });
    } catch (error) {
        console.error('Error uploading PDF to ArDrive:', error);
        res.status(500).json({ error: 'Failed to upload PDF to ArDrive' });
    }
});

module.exports = arDriverouter;