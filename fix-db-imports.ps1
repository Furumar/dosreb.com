$root = Get-Location
$files = Get-ChildItem -Recurse -Include *.ts, *.tsx | Where-Object {
    $_.FullName -notmatch 'lib\\db\\index.ts' -and
    (Test-Path $_.FullName) -and
    (Get-Content $_.FullName | Select-String 'await db')
}

foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    $depth = ($file.DirectoryName.Replace($root.Path, '').Split('\') | Where-Object { $_ -ne '' }).Count
    $relativePath = ('../' * $depth) + 'lib/db'

    $importLine = "import { db } from '$relativePath'"

    # Remove any existing db import
    $lines = $lines | Where-Object { $_ -notmatch 'import\s+\{\s*db\s*\}\s+from' }

    # Insert after any "use client" or top comments
    $insertIndex = 0
    while ($insertIndex -lt $lines.Count -and ($lines[$insertIndex] -match '^(//|/\*|\*|\"use client\")')) {
        $insertIndex++
    }

    $newLines = $lines[0..($insertIndex - 1)] + $importLine + $lines[$insertIndex..($lines.Count - 1)]
    Set-Content $file.FullName $newLines
    Write-Host "✅ Fixed import in $($file.FullName)"
}
