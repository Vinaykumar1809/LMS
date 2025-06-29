// utils/drive.helper.js

import { google } from 'googleapis';
import fs from 'fs/promises';
import fssync from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config(); // Ensure .env is loaded

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ['https://www.googleapis.com/auth/drive'],
});


const drive = google.drive({ version: 'v3', auth });

export const uploadPDFToDrive = async (localFilePath, fileName) => {
  try {
    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: 'application/pdf',
      body: fssync.createReadStream(localFilePath),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });

    // Make file publicly readable
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

   const url = `https://drive.google.com/file/d/${file.data.id}/preview`;


    return {
      public_id: file.data.id,
      secure_url: url,
    };
  } catch (err) {
    throw new Error('Google Drive upload failed: ' + err.message);
  } finally {
    // Optional: delete local file after upload
    await fs.rm(localFilePath);
  }
};

export const deleteFileFromDrive = async (fileId) => {
  try {
    await drive.files.delete({ fileId });
  } catch (err) {
    console.warn('Failed to delete from Google Drive:', err.message);
  }
};
