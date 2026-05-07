# FLOW AGENT: Login smoke (happy path) + basic sanity

# open new browser
playwright-cli open

# navigate to Login page
playwright-cli goto https://practice.expandtesting.com/login

# (optional) snapshot to get element refs
playwright-cli snapshot

# fill username/email (use ref from snapshot)
playwright-cli click e_username
playwright-cli type "practice"

# fill password
playwright-cli click e_password
playwright-cli type "SuperSecretPassword!"

# submit
playwright-cli click e_submit

# verify landing page / success indicator (use ref for a known element/text)
playwright-cli snapshot
playwright-cli assert-visible e_success_banner

# close the browser
playwright-cli close
