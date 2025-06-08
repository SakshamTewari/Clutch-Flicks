import { error } from 'console';
import express from 'express';
import ffmpeg from 'fluent-ffmpeg';

const app = express();

app.post('/process-video', (req, res) => {
  // Get path of input video file from the request body
  const inputFilePath = req.body.inputFilePath;
  const outputFilePath = req.body.outputFilePath;

  if (!inputFilePath || !outputFilePath) {
    const missing = [];
    if (!inputFilePath) missing.push('inputFilePath');
    if (!outputFilePath) missing.push('outputFilePath');
    res.status(400).send(`Bad Request: Missing ${missing.join(' and ')}`);
  }

  // Convert video using ffmpeg
  ffmpeg(inputFilePath)
    .outputOptions('-vf', 'scale=-1:360')
    .on('end', () => {
      res.status(200).send('Processing finished successfully');
    })
    .on('error', () => {
      console.log(`An error occurred: ${error.message}`);
      res.status(500).send(`Internal server error: ${error.message}`);
    })
    .save(outputFilePath); // 360p
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Video Processing Service listening at http://localhost:${PORT}`);
});
