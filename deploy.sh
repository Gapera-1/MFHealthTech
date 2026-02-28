#!/bin/bash

echo "MF HealthTech Industries - Vercel Deployment Script"
echo "==================================================="

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "Please log in to your Vercel account:"
    vercel login
fi

echo ""
echo "Starting deployment..."
echo ""

# Deploy to staging first
echo "Deploying to staging..."
vercel

echo ""
echo "Deployment to staging complete!"
echo ""
echo "To deploy to production, run: vercel --prod"
echo ""
echo "Your site will be available at the URL provided above once deployment completes."