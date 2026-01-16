param(
  [string]$RootPath = "C:\Users\marco\DOSREB\dosreb.com",
  [string]$OutputFile = "C:\Users\marco\DOSREB\project-map.json"
)

function Get-ProjectNode {
  param(
    [string]$Path
  )

  $item = Get-Item $Path

  $node = [ordered]@{
    name = $item.Name
    path = $item.FullName
  }

  if ($item.PSIsContainer) {
    $node.type = "directory"
    $children = @()
    Get-ChildItem $Path -Force | ForEach-Object {
      $children += Get-ProjectNode -Path $_.FullName
    }
    $node.children = $children
  } else {
    $node.type = "file"
  }

  return $node
}

Write-Host "Building project map from $RootPath ..."
if (!(Test-Path $RootPath)) {
  Write-Host "Root path not found: $RootPath" -ForegroundColor Red
  exit 1
}

$rootNode = Get-ProjectNode -Path $RootPath

$projectMap = [ordered]@{
  root  = $RootPath
  nodes = @($rootNode)
}

$projectMapJson = $projectMap | ConvertTo-Json -Depth 100

$dir = Split-Path $OutputFile
if (!(Test-Path $dir)) {
  New-Item -ItemType Directory -Path $dir | Out-Null
}

$projectMapJson | Out-File -FilePath $OutputFile -Encoding utf8

Write-Host "Project map written to $OutputFile" -ForegroundColor Green