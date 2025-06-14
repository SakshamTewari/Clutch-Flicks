/**
 * GCS file interactions
 * Local file interactions
 */

import { Storage } from '@google-cloud/storage';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

const storage = new Storage();

const rawVideoBucketName = 'raw-clutch-videos';
const processedVideoBucketName = 'processed-clutch-videos';

const localRawVideoPath = './raw-videos';
const localProcessedVideoPath = './processed-videos';
/**
 * Creates the local directories for raw and processed videos
 */
export function setUpDirectories() {
  ensureDirectoryExistence(localRawVideoPath);
  ensureDirectoryExistence(localProcessedVideoPath);
}

/**
 * @param rawVideoName - Name of the file to convert from {@link localRawVideoPath}
 * @param processedVideoName - Name of the file to convert to {@link localProcessedVideoPath}
 * @returns A promise that resolves when the video has been converted
 */
export function convertVideo(rawVideoName: string, processedVideoName: string) {
  return new Promise<void>((resolve, reject) => {
    ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
      .outputOptions('-vf', 'scale-1:360')
      .on('end', () => {
        console.log('Processing finished successfully');
        resolve();
      })
      .on('error', (error) => {
        console.log(`An error occurred: ${error.message}`);
        reject(error);
      })
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
  });
}

/**
 * @param fileName - Name of the file to download from the {@link rawVideoBucketName} bucket into the {@link localRawVideoPath} folder.
 * @returns A Promise that resolves when the file has been downloaded
 */
export async function downloadRawVideo(fileName: string) {
  await storage
    .bucket(rawVideoBucketName)
    .file(fileName)
    .download({
      destination: `${localRawVideoPath}/${fileName}}`,
    });

  console.log(
    `gs://${rawVideoBucketName}/${fileName} dowloaded to ${localRawVideoPath}/${fileName}`,
  );
}

/**
 * @param fileName - Name of the file to upload from the {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A Promise that resolves when the file has been uploaded.
 */
export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);

  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName,
  });

  console.log(
    `gs://${localProcessedVideoPath}/${fileName} uploaded to ${processedVideoBucketName}/${fileName}`,
  );

  await bucket.file(fileName).makePublic();
}

/**
 * @param fileName - Name of the file to delete from {@link localRawVideoPath} folder
 * @returns A Promise that resolves when the file has been deleted
 */
export function deleteRawVideo(fileName: string) {
  return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * @param fileName - Name of the file to delete from {@link localProcessedVideoPath} folder
 * @returns A Promise that resolves when the file has been deleted
 */
export function deleteProcessedVideo(fileName: string) {
  return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

/**
 * @param filePath - The path of the file to delete
 * @returns A promise that resolves when the file has been deleted
 */

function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(`Failed to delete file at ${filePath}`, err);
          reject(err);
        } else {
          console.log(`File deleted at ${filePath}`);
          resolve();
        }
      });
    } else {
      console.log(`File not`);
    }
  });
}

/**
 * Ensures a directory exists, creating it if necessary.
 * @param {string} dirPath - The directory path to check.
 */
function ensureDirectoryExistence(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Directory created at: ${dirPath}`);
  }
}
