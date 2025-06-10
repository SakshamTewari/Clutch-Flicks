import express from 'express';

import {
  convertVideo,
  deleteProcessedVideo,
  deleteRawVideo,
  downloadRawVideo,
  setUpDirectories,
  uploadProcessedVideo,
} from './storage';

setUpDirectories();

const app = express();
app.use(express.json());

app.post('/process-video', async (req: any, res: any) => {
  // Get the bucket and file name from Cloud Pub/Sub message
  let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString(
      'utf-8',
    );
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload received');
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send('Bad Request: missing filename');
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  // Download the raw video from Cloud storage
  await downloadRawVideo(inputFileName);

  //Convert the video to 360p
  try {
    await convertVideo(inputFileName, outputFileName);
  } catch (error) {
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName),
    ]);
    console.error(error);
    return res
      .status(500)
      .send('Internal Server Error: Video conversion failed');
  }

  // Upload the processed video back to Cloud Storage
  await uploadProcessedVideo(outputFileName);

  // Delete the video files again from local storage
  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName),
  ]);

  return res.status(200).send('Processing finished successfully');
});
// // Get path of input video file from the request body
// const inputFilePath = req.body.inputFilePath;
// const outputFilePath = req.body.outputFilePath;

// if (!inputFilePath || !outputFilePath) {
//   const missing = [];
//   if (!inputFilePath) missing.push('inputFilePath');
//   if (!outputFilePath) missing.push('outputFilePath');
//   res.status(400).send(`Bad Request: Missing ${missing.join(' and ')}`);
// }

// // Convert video using ffmpeg
// ffmpeg(inputFilePath)
//   .outputOptions('-vf', 'scale=-1:360')
//   .on('end', () => {
//     res.status(200).send('Processing finished successfully');
//   })
//   .on('error', (error) => {
//     console.log(`An error occurred: ${error.message}`);
//     res.status(500).send(`Internal server error: ${error.message}`);
//   })
//   .save(outputFilePath); // 360p

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Video Processing Service listening at http://localhost:${PORT}`);
});
