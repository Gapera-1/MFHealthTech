Write-Host "MF HealthTech Industries - Vercel Deployment Script" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green

# Check if vercel is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Try to check if logged in to Vercel
try {
    vercel whoami | Out-Null
    $isLoggedIn = $true
} catch {
    $isLoggedIn = $false
}

if (-not $isLoggedIn) {
    Write-Host "Please log in to your Vercel account:" -ForegroundColor Yellow
    vercel login
}

Write-Host ""
Write-Host "Starting deployment..." -ForegroundColor Green
Write-Host ""

# Deploy to staging first
Write-Host "Deploying to staging..." -ForegroundColor Cyan
vercel

Write-Host ""
Write-Host "Deployment to staging complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To deploy to production, run: vercel --prod" -ForegroundColor Yellow
Write-Host ""
Write-Host "Your site will be available at the URL provided above once deployment completes." -ForegroundColor Green