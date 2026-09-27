$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$env:GURUJI_ENV_FILE = Join-Path $env:USERPROFILE 'Downloads\atlas-credentials.env'
& "$PSScriptRoot/backend/.venv/Scripts/python.exe" -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
