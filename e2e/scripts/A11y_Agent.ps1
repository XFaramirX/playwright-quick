[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

function Invoke-PlaywrightCli {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    & playwright-cli @Args
    if ($LASTEXITCODE -ne 0) {
        throw "playwright-cli failed with exit code $LASTEXITCODE"
    }
}

Invoke-PlaywrightCli 'open'
Invoke-PlaywrightCli 'goto' 'https://practice.expandtesting.com/login'
Invoke-PlaywrightCli 'snapshot'
Invoke-PlaywrightCli 'click' 'e_username'
Invoke-PlaywrightCli 'type' 'practice'
Invoke-PlaywrightCli 'click' 'e_password'
Invoke-PlaywrightCli 'type' 'SuperSecretPassword!'
Invoke-PlaywrightCli 'click' 'e_submit'
Invoke-PlaywrightCli 'snapshot'
Invoke-PlaywrightCli 'assert-visible' 'e_success_banner'
Invoke-PlaywrightCli 'close'
