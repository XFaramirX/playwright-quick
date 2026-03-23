[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$AgentName,

    [Parameter(Mandatory = $true)]
    [string]$Session,

    [string]$BaseUrl = 'https://practice.expandtesting.com/login'
)

$ErrorActionPreference = 'Stop'

function Invoke-PlaywrightCli {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$CliArgs)

    Write-Host ("[" + $AgentName + "] playwright-cli " + (($CliArgs | ForEach-Object {
        if ($_ -match '\s') { '"' + $_ + '"' } else { $_ }
    }) -join ' '))

    & playwright-cli @CliArgs
    if ($LASTEXITCODE -ne 0) {
        throw "playwright-cli failed with exit code $LASTEXITCODE"
    }
}

$loginCode = @"
await page.goto('$BaseUrl');
await page.fill('input[name="username"]', 'practice');
await page.fill('input[name="password"]', 'SuperSecretPassword!');
await page.click('button[type="submit"]');
await page.waitForSelector('#flash.success', { timeout: 10000 });
const successText = (await page.textContent('#flash')) || '';
if (!successText.includes('You logged into a secure area!')) {
  throw new Error('Login success banner not found');
}
"@

Invoke-PlaywrightCli "-s=$Session" 'open'
Invoke-PlaywrightCli "-s=$Session" 'run-code' $loginCode
Invoke-PlaywrightCli "-s=$Session" 'snapshot'
Invoke-PlaywrightCli "-s=$Session" 'close'

Write-Host ("[" + $AgentName + "] Completed successfully.")
