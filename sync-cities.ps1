$csvCandidates = @(
  (Join-Path $PSScriptRoot "Cities.csv"),
  (Join-Path $PSScriptRoot "cities.csv")
)
$csvPath = $csvCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
$jsonPath = Join-Path $PSScriptRoot "site\\data\\cities.generated.json"

if (-not $csvPath) {
  throw "Cities.csv not found"
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$rows = Import-Csv -Path $csvPath
$result = @()

foreach ($row in $rows) {
  $enabled = ($row.enabled -in @("1", "true", "TRUE", "yes", "YES"))
  if (-not $enabled) { continue }

  $cityRu = [string]$row.city_name_ru
  $cityEn = [string]$row.city_name_en
  $slug = [string]$row.city_slug
  $offersUrl = if ($row.offers_url) { [string]$row.offers_url } elseif ($cityEn -match '^https?://') { $cityEn } else { "" }
  $locationId = if ($row.location_id) { [int]$row.location_id } else { 0 }
  if (-not $locationId -and $offersUrl -match 'location-(\d+)') {
    $locationId = [int]$Matches[1]
  }
  if (-not $slug -and $offersUrl -match 'location-\d+-([^/?#]+)') {
    $slug = [string]$Matches[1]
  }
  $supportsMetro = ($row.supports_metro -in @("1", "true", "TRUE", "yes", "YES"))

  $aliases = @()
  if ($cityRu) { $aliases += $cityRu }
  if ($cityEn -and $cityEn -notmatch '^https?://') { $aliases += $cityEn }
  if ($slug) { $aliases += $slug }

  $result += [pscustomobject]@{
    city_name_ru   = $cityRu
    city_name_en   = $cityEn
    city_slug      = $slug
    offers_url     = $offersUrl
    location_id    = $locationId
    enabled        = $true
    supports_metro = $supportsMetro
    aliases        = $aliases
  }
}

$json = $result | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText($jsonPath, $json, $utf8NoBom)
Write-Host "Updated $jsonPath"
