$ErrorActionPreference = 'Stop'
$mongoRoot = Join-Path $env:LOCALAPPDATA 'GurujiMongo'
$executable = Get-ChildItem (Join-Path $mongoRoot 'server') -Filter mongod.exe -Recurse | Select-Object -First 1
if (-not $executable) { throw 'MongoDB executable missing in LocalAppData/GurujiMongo/server.' }
New-Item -ItemType Directory -Force -Path (Join-Path $mongoRoot 'data') | Out-Null
& $executable.FullName --dbpath (Join-Path $mongoRoot 'data') --bind_ip 127.0.0.1 --port 27017 --logpath (Join-Path $mongoRoot 'mongo.log') --logappend
