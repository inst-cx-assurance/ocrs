param(
  [string]$ArchiveName = 'ocrs-v0.1-audit.zip'
)

$ErrorActionPreference = 'Stop'
$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$repositoryPrefix = $repositoryRoot.TrimEnd('\') + '\'
$archivePath = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot $ArchiveName))
$expectedArchivePath = [System.IO.Path]::GetFullPath((Join-Path $repositoryRoot 'ocrs-v0.1-audit.zip'))

if ($archivePath -ne $expectedArchivePath) {
  throw 'The audit archive target must be ocrs-v0.1-audit.zip in the repository root.'
}

$excludedDirectoryNames = @(
  '.git',
  'node_modules',
  'dist',
  'coverage',
  '.vitest',
  '.cache',
  'cache',
  'caches',
  'tmp',
  'temp'
)
$excludedFilePatterns = @(
  '*.zip',
  '*.log',
  '*.tmp',
  '*.temp',
  '.env',
  '.env.*',
  '*credential*',
  '*secret*',
  '*.pem',
  '*.key',
  '*.p12',
  '*.pfx'
)

$files = Get-ChildItem -LiteralPath $repositoryRoot -File -Recurse -Force | Where-Object {
  $relative = $_.FullName.Substring($repositoryPrefix.Length)
  $segments = $relative -split '[\\/]'
  $directoryExcluded = $segments | Where-Object { $excludedDirectoryNames -contains $_ }
  $fileExcluded = $false
  foreach ($pattern in $excludedFilePatterns) {
    if ($_.Name -like $pattern) {
      $fileExcluded = $true
      break
    }
  }
  -not $directoryExcluded -and -not $fileExcluded
} | Sort-Object FullName

if (Test-Path -LiteralPath $archivePath) {
  Remove-Item -LiteralPath $archivePath
}

Add-Type -AssemblyName System.IO.Compression
$stream = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::CreateNew)
try {
  $zip = [System.IO.Compression.ZipArchive]::new(
    $stream,
    [System.IO.Compression.ZipArchiveMode]::Create,
    $false
  )
  try {
    foreach ($file in $files) {
      $entryName = $file.FullName.Substring($repositoryPrefix.Length).Replace('\', '/')
      $entry = $zip.CreateEntry($entryName, [System.IO.Compression.CompressionLevel]::Optimal)
      # Unix regular file mode 0644 in the upper 16 bits; no platform-specific directory entries.
      $entry.ExternalAttributes = -2119958528
      $entry.LastWriteTime = [System.DateTimeOffset]::new($file.LastWriteTimeUtc)
      $input = [System.IO.File]::OpenRead($file.FullName)
      try {
        $output = $entry.Open()
        try {
          $input.CopyTo($output)
        } finally {
          $output.Dispose()
        }
      } finally {
        $input.Dispose()
      }
    }
  } finally {
    $zip.Dispose()
  }
} finally {
  $stream.Dispose()
}

$archive = Get-Item -LiteralPath $archivePath
$digest = (Get-FileHash -LiteralPath $archivePath -Algorithm SHA256).Hash.ToLowerInvariant()
[pscustomobject]@{
  Archive = $archive.Name
  Entries = $files.Count
  Bytes = $archive.Length
  SHA256 = $digest
}
