$port = 8793
$root = $PSScriptRoot

$mime = @{
  ".html" = "text/html"
  ".css"  = "text/css"
  ".js"   = "application/javascript"
  ".json" = "application/json"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".xml"  = "application/xml"
  ".txt"  = "text/plain"
  ".mp4"  = "video/mp4"
  ".ico"  = "image/x-icon"
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $port)
try {
  $listener.Start()
} catch {
  # Most often this is a second copy of the launcher: the app is already up.
  Write-Host "La porta $port e' gia' in uso: Revolution Sport e' probabilmente gia' avviato su http://localhost:$port/"
  Write-Host "Premi Invio per chiudere questa finestra."
  Read-Host | Out-Null
  exit 1
}
Write-Host "Serving $root on http://localhost:$port/"

while ($true) {
  $client = $listener.AcceptTcpClient()
  # browsers pre-open sockets they may never write to; without a timeout the
  # single-threaded loop blocks there forever and the whole server stops serving
  $client.ReceiveTimeout = 3000
  $client.SendTimeout = 3000
  try {
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $requestLine = $reader.ReadLine()
    while (($headerLine = $reader.ReadLine()) -and $headerLine -ne "") {}

    $status = 200
    $body = [byte[]]@()
    $contentType = "text/plain"

    if ($requestLine -match '^GET\s+(\S+)\s+HTTP') {
      $urlPath = $matches[1].Split('?')[0]
      if ($urlPath -eq "/") { $urlPath = "/index.html" }
      $decoded = [System.Uri]::UnescapeDataString($urlPath).TrimStart("/")
      $filePath = Join-Path $root $decoded
      $fullPath = [System.IO.Path]::GetFullPath($filePath)

      # confronto con il separatore finale: senza, "..\palestra-landing-altro\file" passerebbe il controllo
      $rootWithSep = $root.TrimEnd('\') + '\'
      if ($fullPath.StartsWith($rootWithSep, [System.StringComparison]::OrdinalIgnoreCase) -and (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        $ext = [System.IO.Path]::GetExtension($fullPath)
        $contentType = $mime[$ext]
        if (-not $contentType) { $contentType = "application/octet-stream" }
        $body = [System.IO.File]::ReadAllBytes($fullPath)
      } else {
        $status = 404
        $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
      }
    } else {
      $status = 400
      $body = [System.Text.Encoding]::UTF8.GetBytes("400 Bad Request")
    }

    $statusText = if ($status -eq 200) { "OK" } elseif ($status -eq 404) { "Not Found" } else { "Bad Request" }
    $headerText = "HTTP/1.1 $status $statusText`r`nContent-Type: $contentType`r`nContent-Length: $($body.Length)`r`nX-Content-Type-Options: nosniff`r`nReferrer-Policy: strict-origin-when-cross-origin`r`nConnection: close`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headerText)
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    $stream.Write($body, 0, $body.Length)
    $stream.Flush()
  } catch {
  } finally {
    $client.Close()
  }
}
