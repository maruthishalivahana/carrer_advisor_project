# Google Cloud Deployment Script for Career Advisor Backend (PowerShell)
# Make sure you have gcloud CLI installed and authenticated

param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectId
)

$ErrorActionPreference = "Stop"

# Configuration
$Region = "us-central1"
$ServiceName = "career-advisor-backend"
$ImageName = "gcr.io/$ProjectId/$ServiceName"

Write-Host "Starting deployment to Google Cloud..." -ForegroundColor Green
Write-Host "Project ID: $ProjectId" -ForegroundColor Yellow
Write-Host "Region: $Region" -ForegroundColor Yellow
Write-Host "Service: $ServiceName" -ForegroundColor Yellow

# Check if gcloud is installed
try {
    gcloud version | Out-Null
} catch {
    Write-Host "gcloud CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Set the project
Write-Host "Setting project..." -ForegroundColor Blue
gcloud config set project $ProjectId

# Enable required APIs
Write-Host "Enabling required APIs..." -ForegroundColor Blue
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push the image
Write-Host "Building and pushing Docker image..." -ForegroundColor Blue
gcloud builds submit --tag $ImageName .

# Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Blue
gcloud run deploy $ServiceName `
    --image $ImageName `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --memory 1Gi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10 `
    --set-env-vars NODE_ENV=production,PORT=8080

# Get the service URL
$ServiceUrl = gcloud run services describe $ServiceName --region=$Region --format='value(status.url)'

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Service URL: $ServiceUrl" -ForegroundColor Cyan
Write-Host "Health check: $ServiceUrl/health" -ForegroundColor Cyan

# Optional: Set up custom domain (uncomment if needed)
# Write-Host "Setting up custom domain..." -ForegroundColor Blue
# gcloud run domain-mappings create --service $ServiceName --domain your-domain.com --region $Region
