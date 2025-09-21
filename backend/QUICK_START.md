# Quick Start - Deploy to Google Cloud

## Prerequisites
- Google Cloud account
- gcloud CLI installed
- Your project ID

## 1. Authenticate
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

## 2. Set up Database
- Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
- Create a free cluster
- Get your connection string

## 3. Deploy (Windows PowerShell)
```powershell
.\deploy.ps1 YOUR_PROJECT_ID
```

## 4. Set Environment Variables
```bash
gcloud run services update career-advisor-backend \
    --region us-central1 \
    --set-env-vars MONGODB_URL=your_mongodb_url,JWT_SECRET=your_jwt_secret
```

## 5. Test
Visit: `https://your-service-url/health`

That's it! Your backend is now deployed to Google Cloud Run.
