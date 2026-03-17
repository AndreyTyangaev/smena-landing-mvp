$ErrorActionPreference = "Stop"

$csvCandidates = @(
  (Join-Path $PSScriptRoot "cities.csv"),
  (Join-Path $PSScriptRoot "Cities.csv")
)
$csvPath = $csvCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
$jsonPath = Join-Path $PSScriptRoot "site\\data\\cities.generated.json"

if (-not $csvPath) {
  throw "cities.csv not found"
}

function Repair-Text {
  param([string]$Value)

  $text = [string]$Value
  if ([string]::IsNullOrWhiteSpace($text)) { return "" }

  for ($i = 0; $i -lt 2; $i++) {
    if ($text -notmatch '[РСЃÐÑ]') { break }
    try {
      $latin1 = [System.Text.Encoding]::GetEncoding("ISO-8859-1")
      $bytes = $latin1.GetBytes($text)
      $decoded = [System.Text.Encoding]::UTF8.GetString($bytes)
      if ([string]::IsNullOrWhiteSpace($decoded) -or $decoded -eq $text) { break }
      $text = $decoded
    } catch {
      break
    }
  }

  return $text.Trim()
}

function To-Bool {
  param($Value)
  $normalized = [string]$Value
  return $normalized -in @("1", "true", "TRUE", "yes", "YES")
}

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
$raw = [System.IO.File]::ReadAllText($csvPath, [System.Text.Encoding]::UTF8).TrimStart([char]0xFEFF)
$rows = $raw | ConvertFrom-Csv
$result = @()

foreach ($row in $rows) {
  if (-not (To-Bool $row.enabled)) { continue }

  $cityRu = Repair-Text $row.city_name_ru
  $cityEnRaw = Repair-Text $row.city_name_en
  $citySlug = Repair-Text $row.city_slug
  $offersUrl = if ($row.offers_url) { [string]$row.offers_url } elseif ($cityEnRaw -match '^https?://') { $cityEnRaw } else { "" }
  $cityEn = if ($cityEnRaw -match '^https?://') { "" } else { $cityEnRaw }
  $locationId = if ($row.location_id) { [int]$row.location_id } else { 0 }

  if (-not $locationId -and $offersUrl -match 'location-(\d+)') {
    $locationId = [int]$Matches[1]
  }

  if (-not $citySlug -and $offersUrl -match 'location-\d+-([^/?#]+)') {
    $citySlug = [string]$Matches[1]
  }

  $aliases = New-Object System.Collections.Generic.List[string]
  foreach ($candidate in @($cityRu, $cityEn, $citySlug)) {
    if (-not [string]::IsNullOrWhiteSpace($candidate) -and -not $aliases.Contains($candidate)) {
      $aliases.Add($candidate)
    }
  }

  $result += [pscustomobject]@{
    city_name_ru   = $cityRu
    city_name_en   = $cityEn
    city_slug      = $citySlug
    offers_url     = $offersUrl
    location_id    = $locationId
    enabled        = $true
    supports_metro = (To-Bool $row.supports_metro)
    aliases        = $aliases
  }
}

$json = $result | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText($jsonPath, $json, $utf8NoBom)

Write-Host "Updated $jsonPath from $csvPath"
