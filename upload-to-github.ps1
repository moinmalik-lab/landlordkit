# ============================================================
# LandlordKit — GitHub Uploader
# Run this script from INSIDE your landlordkit folder
# It uploads every file directly to GitHub via API
# No git installation required
# ============================================================

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  LandlordKit — GitHub Uploader" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ── SETTINGS ──────────────────────────────────────────────
$repo  = "moinmalik-lab/landlordkit"
$branch = "main"
# ──────────────────────────────────────────────────────────

# Ask for token securely
Write-Host "Enter your GitHub Personal Access Token" -ForegroundColor Yellow
Write-Host "(Go to github.com/settings/tokens to create one with 'repo' scope)" -ForegroundColor Gray
Write-Host ""
$secureToken = Read-Host -Prompt "Token" -AsSecureString
$token = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureToken)
)

$headers = @{
    "Authorization" = "token $token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "LandlordKit-Uploader"
}

# Verify token works
Write-Host ""
Write-Host "Verifying GitHub connection..." -ForegroundColor Gray
try {
    $repoInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo" -Headers $headers -Method Get
    Write-Host "Connected to: $($repoInfo.full_name)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Could not connect to GitHub repo '$repo'" -ForegroundColor Red
    Write-Host "Check your token has 'repo' scope and the repo exists." -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Get all files in current directory (excluding .git and the script itself)
$scriptName = Split-Path $MyInvocation.MyCommand.Path -Leaf
$allFiles = Get-ChildItem -Recurse -File -Path "." |
    Where-Object { 
        $_.FullName -notmatch "\\.git\\" -and 
        $_.Name -ne $scriptName -and
        $_.Name -ne "landlordkit.zip"
    }

Write-Host ""
Write-Host "Found $($allFiles.Count) files to upload..." -ForegroundColor Cyan
Write-Host ""

$success = 0
$failed  = 0

foreach ($file in $allFiles) {
    # Build the relative path (forward slashes for GitHub API)
    $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart("\").Replace("\", "/")
    
    # Read file as base64
    $bytes   = [IO.File]::ReadAllBytes($file.FullName)
    $content = [Convert]::ToBase64String($bytes)
    
    try {
        # Check if file already exists (need SHA to update)
        $sha = $null
        try {
            $existing = Invoke-RestMethod `
                -Uri "https://api.github.com/repos/$repo/contents/$relativePath" `
                -Headers $headers -Method Get
            $sha = $existing.sha
        } catch {
            # File doesn't exist yet — that's fine
        }
        
        # Build request body
        $bodyObj = @{
            message = if ($sha) { "Update $relativePath" } else { "Add $relativePath" }
            content = $content
            branch  = $branch
        }
        if ($sha) { $bodyObj["sha"] = $sha }
        
        $body = $bodyObj | ConvertTo-Json -Compress
        
        Invoke-RestMethod `
            -Uri "https://api.github.com/repos/$repo/contents/$relativePath" `
            -Headers $headers -Method Put -Body $body `
            -ContentType "application/json" | Out-Null
        
        Write-Host "  [OK] $relativePath" -ForegroundColor Green
        $success++
        
    } catch {
        Write-Host "  [FAIL] $relativePath — $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }
    
    # Small pause to avoid GitHub rate limiting
    Start-Sleep -Milliseconds 300
}

# ── SUMMARY ───────────────────────────────────────────────
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  Upload complete!" -ForegroundColor Cyan
Write-Host "  Uploaded:  $success files" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "  Failed:    $failed files" -ForegroundColor Red
}
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your repo: https://github.com/$repo" -ForegroundColor Yellow
Write-Host ""
Write-Host "NEXT STEP — Enable GitHub Pages:" -ForegroundColor Cyan
Write-Host "1. Go to https://github.com/$repo/settings/pages" -ForegroundColor White
Write-Host "2. Source: Deploy from branch" -ForegroundColor White
Write-Host "3. Branch: main  /  Folder: / (root)" -ForegroundColor White
Write-Host "4. Save — your site will be live in ~60 seconds at:" -ForegroundColor White
Write-Host "   https://moinmalik-lab.github.io/landlordkit" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
