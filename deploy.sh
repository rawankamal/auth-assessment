#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment to Google Cloud Run...${NC}"

# Set your project ID
PROJECT_ID="blogsync"
SERVICE_NAME="auth-assessment"
REGION="us-central1"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ gcloud CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Set the project
echo -e "${YELLOW}📋 Setting project to ${PROJECT_ID}...${NC}"
gcloud config set project ${PROJECT_ID}

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build the application locally first to check for errors
echo -e "${YELLOW}🔨 Building application locally...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Please fix the errors and try again.${NC}"
    exit 1
fi

# Submit the build to Cloud Build
echo -e "${YELLOW}🏗️ Submitting to Cloud Build...${NC}"
gcloud builds submit --config=cloudbuild.yaml .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"

    # Get the service URL
    SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} --region=${REGION} --format='value(status.url)')
    echo -e "${GREEN}🌐 Your application is running at: ${SERVICE_URL}${NC}"

    # Show logs command
    echo -e "${YELLOW}📜 To view logs, run:${NC}"
    echo "gcloud run services logs read ${SERVICE_NAME} --region=${REGION}"
else
    echo -e "${RED}❌ Deployment failed. Check the logs above for details.${NC}"

    # Show troubleshooting commands
    echo -e "${YELLOW}🔍 Troubleshooting commands:${NC}"
    echo "1. View Cloud Build logs:"
    echo "   gcloud builds list --limit=1"
    echo "2. View Cloud Run logs:"
    echo "   gcloud run services logs read ${SERVICE_NAME} --region=${REGION}"
    echo "3. Describe the service:"
    echo "   gcloud run services describe ${SERVICE_NAME} --region=${REGION}"

    exit 1
fi
