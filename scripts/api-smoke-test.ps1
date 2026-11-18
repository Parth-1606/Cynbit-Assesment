# End-to-end API smoke test for the Cynbit Discovery API.
# Pure ASCII on purpose: PowerShell 5.1 reads .ps1 files as ANSI when there is
# no BOM, so the rupee sign and en dash are built at runtime instead.
# Usage: powershell -ExecutionPolicy Bypass -File scripts\api-smoke-test.ps1
$ErrorActionPreference = 'Continue'
$base = 'http://localhost:5000'
$token = 'super-secret-admin-token-123'
$script:pass = 0
$script:fail = 0

$RUPEE = [string][char]0x20B9   # INR sign
$DASH  = [string][char]0x2013   # en dash

function Assert-Status($name, $actual, $expected) {
  if ($expected -contains $actual) {
    Write-Host ("  PASS  " + $name + " -> " + $actual) -ForegroundColor Green
    $script:pass++
  } else {
    $exp = ($expected -join '/')
    Write-Host ("  FAIL  " + $name + " -> expected " + $exp + ", got " + $actual) -ForegroundColor Red
    $script:fail++
  }
}

function Invoke-Api($method, $path, $body, $headers) {
  if ($null -eq $headers) { $headers = @{} }
  $params = @{ Uri = "$base$path"; Method = $method; UseBasicParsing = $true }
  if ($body) {
    # Windows PowerShell 5.1 would otherwise encode the body as ANSI and
    # corrupt the rupee sign / en dash, so send explicit UTF-8 bytes.
    $params.Body = [System.Text.Encoding]::UTF8.GetBytes($body)
    $params.ContentType = 'application/json; charset=utf-8'
  }
  if ($headers.Count -gt 0) { $params.Headers = $headers }
  try {
    $resp = Invoke-WebRequest @params
    return @{ Status = [int]$resp.StatusCode; Body = $resp.Content }
  } catch {
    $status = 0
    if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode }
    $message = ''
    try { $message = $_.ErrorDetails.Message } catch { }
    return @{ Status = $status; Body = $message }
  }
}

$valid = @{
  name           = 'Parth Pawar'
  email          = 'parth@example.com'
  company        = 'Acme Labs'
  goal           = 'Build a new digital product'
  solution       = 'Website / Web Application'
  budget         = ($RUPEE + '50,000' + $DASH + $RUPEE + '1,00,000')
  timeline       = ('1' + $DASH + '3 months')
  description    = 'We need a customer portal with authentication, billing and reporting.'
  recommendation = 'Full Stack Development'
} | ConvertTo-Json

Write-Host "`n--- Health ---" -ForegroundColor Cyan
$r = Invoke-Api GET '/api/health' $null $null
Assert-Status 'GET /api/health' $r.Status 200

Write-Host "`n--- Validation ---" -ForegroundColor Cyan
$r = Invoke-Api POST '/api/projects' '{}' $null
Assert-Status 'POST empty body -> 400' $r.Status 400

$badEmail = $valid -replace 'parth@example.com', 'not-an-email'
$r = Invoke-Api POST '/api/projects' $badEmail $null
Assert-Status 'POST invalid email -> 400' $r.Status 400

$badGoal = $valid -replace 'Build a new digital product', 'Made up goal'
$r = Invoke-Api POST '/api/projects' $badGoal $null
Assert-Status 'POST unknown goal -> 400' $r.Status 400

$shortDesc = $valid -replace 'We need a customer portal with authentication, billing and reporting.', 'too short'
$r = Invoke-Api POST '/api/projects' $shortDesc $null
Assert-Status 'POST short description -> 400' $r.Status 400

Write-Host "`n--- Create (POST /api/projects) ---" -ForegroundColor Cyan
$r = Invoke-Api POST '/api/projects' $valid $null
Assert-Status 'POST valid inquiry -> 201' $r.Status 201
$created = $null
if ($r.Body) { try { $created = $r.Body | ConvertFrom-Json } catch { } }
if ($created -and $created.data.id) {
  Write-Host ("  INFO  created id: " + $created.data.id) -ForegroundColor DarkGray
}

Write-Host "`n--- Admin auth (GET /api/projects) ---" -ForegroundColor Cyan
$r = Invoke-Api GET '/api/projects' $null $null
Assert-Status 'GET no token -> 401' $r.Status 401

$r = Invoke-Api GET '/api/projects' $null @{ Authorization = 'Bearer wrong-token' }
Assert-Status 'GET bad token -> 401' $r.Status 401

$r = Invoke-Api GET '/api/projects?limit=10' $null @{ Authorization = "Bearer $token" }
Assert-Status 'GET with valid token -> 200' $r.Status 200

if ($r.Body) {
  try {
    $list = $r.Body | ConvertFrom-Json
    Write-Host ("  INFO  returned " + $list.count + " record(s)") -ForegroundColor DarkGray
    if ($list.data -and $list.data.Count -gt 0) {
      $first = $list.data[0]
      Write-Host ("  INFO  newest: " + $first.name + " / " + $first.recommendation) -ForegroundColor DarkGray
      $fields = 'name','email','company','goal','solution','budget','timeline','description','recommendation','createdAt'
      $missing = @($fields | Where-Object { -not ($first.PSObject.Properties.Name -contains $_) })
      if ($missing.Count -gt 0) {
        Write-Host ("  FAIL  missing schema fields: " + ($missing -join ', ')) -ForegroundColor Red
        $script:fail++
      } else {
        Write-Host '  PASS  all schema fields present' -ForegroundColor Green
        $script:pass++
      }
    }
  } catch {
    Write-Host '  WARN  could not parse response' -ForegroundColor Yellow
  }
}

$r = Invoke-Api GET '/api/projects?limit=abc' $null @{ Authorization = "Bearer $token" }
Assert-Status 'GET bad limit falls back -> 200' $r.Status 200

Write-Host "`n--- Error handling ---" -ForegroundColor Cyan
$r = Invoke-Api GET '/api/does-not-exist' $null $null
Assert-Status 'Unknown route -> 404' $r.Status 404

$r = Invoke-Api POST '/api/projects' '{"name": ' $null
Assert-Status 'Malformed JSON -> 400' $r.Status 400

Write-Host ''
if ($script:fail -eq 0) {
  Write-Host ("=== Results: " + $script:pass + " passed, 0 failed ===") -ForegroundColor Green
  exit 0
} else {
  Write-Host ("=== Results: " + $script:pass + " passed, " + $script:fail + " failed ===") -ForegroundColor Red
  exit 1
}
