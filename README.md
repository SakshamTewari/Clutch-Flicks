# Clutch-Flicks

Precision under pressure. One bullet, one chance. Whether it’s a 1v5 clutch or a lightning-fast flick to the head — these are the moments that make Valorant legendary. Watch, upload, and relive your coldest clutches and cleanest flicks. Because aim isn’t luck — it’s a highlight waiting to happen.

## 📦 Features

- 🎮 Upload raw Valorant clips (MP4/WebM)
- ✂️ Automatically trim, crop, and compress using FFmpeg
- 🌐 Host processed clips via Node.js server
- 🐳 Dockerized for easy deployment
- 💾 Stores uploaded files to local disk (can be extended to cloud)

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/clutch-flicks.git
cd clutch-flicks
```

### 2. Build the Docker Image

```bash
docker build -t clutch-flicks ./video processing service
```

### 3. Run the App

```bash
docker run -p 3000:3000  clutch-flicks
```

## API Endpoints (...in progress)

### `POST /process-video Process a raw clip`

## Future Plans

    - Frontend Upload Form (React.js/Next.js)
    - Add tagging and search for clips
    - S3/Cloudinary storage
    - Auth for upload/delete

## 🤝Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you’d like to change.
