# LandlordKit GitHub Uploader
# Run from INSIDE your landlordkit folder
# Uploads all files directly to GitHub via API

Write-Host ""
Write-Host "LandlordKit - GitHub Uploader" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

$repo   = "moinmalik-lab/landlordkit"
$branch = "main"

Write-Host "Enter your GitHub Personal Access Token" -ForegroundColor Yellow
Write-Host "(github.com/settings/tokens - needs repo scope)" -ForegroundColor Gray
Write-Host ""
$token = Read-Host -Prompt "Paste token here"

$headers = @{
    "Authorization" = "token $token"
    "Accept"        = "application/vnd.github.v3+json"
    "User-Agent"    = "LandlordKit-Uploader"
}

Write-Host ""
Write-Host "Checking GitHub connection..." -ForegroundColor Gray

try {
    $repoInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo" -Headers $headers -Method Get
    Write-Host "Connected: $($repoInfo.full_name)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Cannot connect to GitHub repo." -ForegroundColor Red
    Write-Host "Check your token and that the repo exists." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

$scriptName = "upload-to-github.ps1"
$allFiles = Get-ChildItem -Recurse -File -Path "." | Where-Object {
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
    $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart("\").Replace("\", "/")
    $bytes   = [IO.File]::ReadAllBytes($file.FullName)
    $content = [Convert]::ToBase64String($bytes)

    try {
        $sha = $null
        try {
            $existing = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/contents/$relativePath" -Headers $headers -Method Get
            $sha = $existing.sha
        } catch {
            # File does not exist yet - that is fine
        }

        $bodyObj = @{
            message = "Add $relativePath"
            content = $content
            branch  = $branch
        }
        if ($sha) {
            $bodyObj["message"] = "Update $relativePath"
            $bodyObj["sha"] = $sha
        }

        $body = $bodyObj | ConvertTo-Json -Compress

        Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/contents/$relativePath" -Headers $headers -Method Put -Body $body -ContentType "application/json" | Out-Null

        Write-Host "  [OK] $relativePath" -ForegroundColor Green
        $success++

    } catch {
        Write-Host "  [FAIL] $relativePath" -ForegroundColor Red
        $failed++
    }

    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Done! Uploaded: $success files" -ForegroundColor Green
if ($failed -gt 0) {
    Write-Host "Failed: $failed files" -ForegroundColor Red
}
Write-Host ""
Write-Host "Repo: https://github.com/$repo" -ForegroundColor Yellow
Write-Host ""
Write-Host "NEXT - Enable GitHub Pages:" -ForegroundColor Cyan
Write-Host "1. Go to: https://github.com/$repo/settings/pages" -ForegroundColor White
Write-Host "2. Source: Deploy from branch" -ForegroundColor White
Write-Host "3. Branch: main  /  Folder: / (root)" -ForegroundColor White
Write-Host "4. Save - site will be live at:" -ForegroundColor White
Write-Host "   https://moinmalik-lab.github.io/landlordkit" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to exit"
