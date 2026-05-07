[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$logDir = Join-Path $scriptDir (Join-Path '..\..\logs' $timestamp)
$logDir = [System.IO.Path]::GetFullPath($logDir)

New-Item -ItemType Directory -Path $logDir -Force | Out-Null

Write-Host "Starting all Playwright CLI agents in parallel..."
Write-Host "Logs will be stored in $logDir"
Write-Host ""

$agentScripts = @(
    'A11y_Agent.ps1',
    'Flow_Agent.ps1',
    'Responsive_Agent.ps1',
    'Selectors_Agent.ps1'
)

$jobs = @()
foreach ($name in $agentScripts) {
    $scriptPath = Join-Path $scriptDir $name
    $logPath = Join-Path $logDir (($name -replace '\.ps1$', '').ToLower() + '.log')

    $jobs += Start-Job -Name ($name -replace '\.ps1$', '') -ScriptBlock {
        param($scriptPath, $logPath)

        & powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File $scriptPath *> $logPath
        [pscustomobject]@{
            Script   = [System.IO.Path]::GetFileName($scriptPath)
            LogPath  = $logPath
            ExitCode = $LASTEXITCODE
        }
    } -ArgumentList $scriptPath, $logPath
}

Write-Host "Agents running..."
foreach ($job in $jobs) {
    Write-Host ("{0} JobId: {1}" -f $job.Name, $job.Id)
}
Write-Host ""

Wait-Job -Job $jobs | Out-Null

$failed = $false
$results = foreach ($job in $jobs) {
    if ($job.State -ne 'Completed') {
        $failed = $true
        [pscustomobject]@{
            Script   = $job.Name + '.ps1'
            LogPath  = ''
            ExitCode = 999
        }
    } else {
        Receive-Job -Job $job
    }
}

$results | Sort-Object Script | ForEach-Object {
    Write-Host ("{0} -> exit {1}" -f $_.Script, $_.ExitCode)
    if ($_.ExitCode -ne 0) { $failed = $true }
}

Get-Content (Join-Path $logDir '*.log') | Set-Content (Join-Path $logDir 'unified.log')

foreach ($job in $jobs) { Remove-Job -Job $job -Force }

if ($failed) {
    Write-Host "One or more agents failed. Check logs in $logDir"
    exit 1
}

Write-Host "All agents completed successfully."
Write-Host "Unified log: $(Join-Path $logDir 'unified.log')"
