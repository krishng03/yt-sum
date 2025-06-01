# 🚀 YouTube Video Summarizer with AI

[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-brightgreen?logo=mongodb)](https://www.mongodb.com/)

An intelligent video summarization tool that combines YouTube metadata analysis with Gemini AI-powered insights.

## ✨ Features

- 🔍 **Video Analysis**: Extract key metadata from YouTube videos
- 🧠 **AI Summarization**: Generate concise summaries using Google Gemini
- 📊 **Trend Insights**: Identify trending topics and patterns
- 📁 **History Storage**: Save search history in MongoDB
- ⚡ **Real-time Processing**: Get results in seconds
- 🔒 **Secure API**: Protect sensitive operations with rate limiting

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/krishng03/yt-sum.git
cd yt-sum
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create `.env` file:
```env
YOUTUBE_API_KEY=your_youtube_data_v3_key
GEMINI_API_KEY=your_google_gemini_key
MONGODB_URI=mongodb://localhost:27017/ytsum
```
- Download MongoDB and setup compass GUI, add Mongo connection URI
## 🔑 API Keys Setup

1. **YouTube Data API v3**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create project → Enable YouTube Data API v3
   - Create credentials → API key

2. **Google Gemini API**
   - Visit [Google AI Studio](https://aistudio.google.com/)
   - Get API key for Gemini Pro

3. **MongoDB Setup** (choose one)
    - Setup using MongoDB Compass, download community edition

## 🚦 Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Visit `http://localhost:3000` in your browser
