import { arDriveFactory, wrapFileOrFolder, EID } from 'ardrive-core-js';
import fs from 'fs';
import path from 'path';

async function initializeArDrive(walletPath) {
    const { readJWKFile } = await import('ardrive-core-js');
    const wallet = readJWKFile(walletPath);
    return arDriveFactory({ wallet });
}

export async function uploadHTMLToArDrive(
    walletPath,
    htmlContent,
    destFolderId,
    driveKey
) {
    const arDrive = await initializeArDrive(walletPath);
    const tempFilePath = path.join(__dirname, 'temp.html');
    fs.writeFileSync(tempFilePath, htmlContent);
    const wrappedEntity = wrapFileOrFolder(tempFilePath);
    const uploadResult = await arDrive.uploadAllEntities({
        entitiesToUpload: [{ wrappedEntity, destFolderId: EID(destFolderId), driveKey }],
    });
    fs.unlinkSync(tempFilePath);
    return uploadResult;
}

export async function uploadPDFToArDrive(
    walletPath,
    pdfBuffer,
    destFolderId,
    driveKey
) {
    const arDrive = await initializeArDrive(walletPath);
    const tempFilePath = path.join(__dirname, 'temp.pdf');
    fs.writeFileSync(tempFilePath, pdfBuffer);
    const wrappedEntity = wrapFileOrFolder(tempFilePath);
    const uploadResult = await arDrive.uploadAllEntities({
        entitiesToUpload: [{ wrappedEntity, destFolderId: EID(destFolderId), driveKey }],
    });
    fs.unlinkSync(tempFilePath);
    return uploadResult;
}
