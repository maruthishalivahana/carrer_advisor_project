#!/bin/bash

# Google Cloud Deployment Script for Career Advisor Backend
# Make sure you have gcloud CLI installed and authenticated

set -e

# Configuration
PROJECT_ID=${1:-"your-project-id"}
REGION="us-central1"
SERVICE_NAME="career-advisor-backend"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting deployment to Google Cloud..."
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first."
    exit 1
fi

# Set the project
echo "📋 Setting project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push the image
echo "🏗️ Building and pushing Docker image..."
gcloud builds submit --tag $IMAGE_NAME .

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars NODE_ENV=production,PORT=8080

# Get the service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')

echo "✅ Deployment completed successfully!"
echo "🌐 Service URL: $SERVICE_URL"
echo "🔍 Health check: $SERVICE_URL/health"

# Optional: Set up custom domain (uncomment if needed)
# echo "🌍 Setting up custom domain..."
# gcloud run domain-mappings create --service $SERVICE_NAME --domain your-domain.com --region $REGION
