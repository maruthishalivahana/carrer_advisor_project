# Google Cloud Deployment Guide

This guide will help you deploy your Career Advisor backend to Google Cloud Platform using Cloud Run.

## Prerequisites

1. **Google Cloud Account**: Sign up at [Google Cloud Console](https://console.cloud.google.com/)
2. **Google Cloud CLI**: Install the [gcloud CLI](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Install [Docker](https://docs.docker.com/get-docker/) (optional, for local testing)

## Step 1: Set Up Google Cloud Project

1. Create a new project in [Google Cloud Console](https://console.cloud.google.com/)
2. Note your Project ID
3. Enable billing for your project

## Step 2: Authenticate with Google Cloud

```bash
# Login to Google Cloud
gcloud auth login

# Set your project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 3: Set Up Database

### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Update the `MONGODB_URL` environment variable

### Option B: Cloud SQL
1. Create a Cloud SQL instance in Google Cloud Console
2. Set up MongoDB on the instance
3. Configure connection string

## Step 4: Configure Environment Variables

1. Copy `env.example` to `.env`:
```bash
cp env.example .env
```

2. Update the following variables in `.env`:
   - `MONGODB_URL`: Your production database URL
   - `JWT_SECRET`: A secure secret key
   - `GOOGLE_CLOUD_PROJECT_ID`: Your Google Cloud project ID
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed origins

## Step 5: Deploy to Google Cloud

### Option A: Using the Deployment Script (Recommended)

```bash
# Make the script executable (if not already done)
chmod +x deploy.sh

# Run the deployment script
./deploy.sh YOUR_PROJECT_ID
```

### Option B: Manual Deployment

```bash
# Build and push the image
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/career-advisor-backend .

# Deploy to Cloud Run
gcloud run deploy career-advisor-backend \
    --image gcr.io/YOUR_PROJECT_ID/career-advisor-backend \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production,PORT=8080
```

## Step 6: Set Up Environment Variables in Cloud Run

After deployment, set your environment variables:

```bash
gcloud run services update career-advisor-backend \
    --region us-central1 \
    --set-env-vars MONGODB_URL=your_mongodb_url,JWT_SECRET=your_jwt_secret,ALLOWED_ORIGINS=your_frontend_url
```

## Step 7: Test Your Deployment

1. Get your service URL:
```bash
gcloud run services describe career-advisor-backend --region=us-central1 --format='value(status.url)'
```

2. Test the health endpoint:
```bash
curl https://your-service-url/health
```

## Step 8: Set Up Custom Domain (Optional)

```bash
# Map a custom domain
gcloud run domain-mappings create \
    --service career-advisor-backend \
    --domain your-domain.com \
    --region us-central1
```

## Monitoring and Logs

- **View logs**: `gcloud logs read --service=career-advisor-backend`
- **Monitor**: Use Google Cloud Console > Cloud Run > career-advisor-backend
- **Metrics**: Available in Google Cloud Monitoring

## Troubleshooting

### Common Issues:

1. **Build fails**: Check your Dockerfile and ensure all dependencies are in package.json
2. **Service won't start**: Check logs for database connection issues
3. **CORS errors**: Verify ALLOWED_ORIGINS environment variable
4. **Memory issues**: Increase memory allocation in Cloud Run settings

### Useful Commands:

```bash
# View service details
gcloud run services describe career-advisor-backend --region=us-central1

# Update service configuration
gcloud run services update career-advisor-backend --region=us-central1 --memory=2Gi

# Delete service
gcloud run services delete career-advisor-backend --region=us-central1
```

## Cost Optimization

- Use `--min-instances 0` to scale to zero when not in use
- Set appropriate `--max-instances` based on expected traffic
- Monitor usage in Google Cloud Console
- Consider using preemptible instances for non-critical workloads

## Security Best Practices

1. Use environment variables for sensitive data
2. Enable authentication if needed: `--no-allow-unauthenticated`
3. Use HTTPS only (enabled by default in Cloud Run)
4. Regularly update dependencies
5. Use Google Cloud Secret Manager for sensitive data

## Next Steps

1. Set up CI/CD with Cloud Build
2. Configure monitoring and alerting
3. Set up custom domain with SSL
4. Implement proper logging and error handling
5. Set up backup strategies for your database
