Add-Type -AssemblyName System.Drawing

function Resize-Icon {
    param (
        [string]$sourcePath,
        [string]$destPath,
        [int]$width,
        [int]$height,
        [string]$bgColorHex = "#FFF9F0",
        [float]$paddingRatio = 0.12
    )

    $srcImg = [System.Drawing.Image]::FromFile($sourcePath)
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # Fill elegant cream/white background matching Amax Craft theme
    $bgColor = [System.Drawing.ColorTranslator]::FromHtml($bgColorHex)
    $brush = New-Object System.Drawing.SolidBrush($bgColor)
    $g.FillRectangle($brush, 0, 0, $width, $height)

    # Compute scaled size with safe padding
    $availW = $width * (1.0 - (2.0 * $paddingRatio))
    $availH = $height * (1.0 - (2.0 * $paddingRatio))

    $scale = [Math]::Min($availW / $srcImg.Width, $availH / $srcImg.Height)
    $drawW = [int]($srcImg.Width * $scale)
    $drawH = [int]($srcImg.Height * $scale)

    $posX = [int](($width - $drawW) / 2)
    $posY = [int](($height - $drawH) / 2)

    $g.DrawImage($srcImg, $posX, $posY, $drawW, $drawH)

    $dir = Split-Path -Path $destPath -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $srcImg.Dispose()
    Write-Host "Generated: $destPath ($width x $height)"
}

$logoPath = "C:\AMAX APP\amax craftapp\amax craft main\public\amax_logo.png"
$splashPath = "C:\AMAX APP\amax craftapp\amax craft main\public\splash_screen.jpg"
$resDir = "C:\AMAX APP\amax craftapp\amax craft main\android\app\src\main\res"

# Standard Mipmap Sizes for Android Launchers
$mipmaps = @(
    @{ folder = "mipmap-mdpi";    size = 48;  fgSize = 108 },
    @{ folder = "mipmap-hdpi";    size = 72;  fgSize = 162 },
    @{ folder = "mipmap-xhdpi";   size = 96;  fgSize = 216 },
    @{ folder = "mipmap-xxhdpi";  size = 144; fgSize = 324 },
    @{ folder = "mipmap-xxxhdpi"; size = 192; fgSize = 432 }
)

foreach ($m in $mipmaps) {
    $folder = $m.folder
    $size = $m.size
    $fgSize = $m.fgSize

    Resize-Icon -sourcePath $logoPath -destPath "$resDir\$folder\ic_launcher.png" -width $size -height $size -bgColorHex "#FFF9F0" -paddingRatio 0.10
    Resize-Icon -sourcePath $logoPath -destPath "$resDir\$folder\ic_launcher_round.png" -width $size -height $size -bgColorHex "#FFF9F0" -paddingRatio 0.12
    Resize-Icon -sourcePath $logoPath -destPath "$resDir\$folder\ic_launcher_foreground.png" -width $fgSize -height $fgSize -bgColorHex "#FFF9F0" -paddingRatio 0.20
}

# Android Native Splash Screens
$splashSizes = @(
    @{ folder = "drawable";             w = 480;  h = 800 },
    @{ folder = "drawable-land-hdpi";   w = 800;  h = 480 },
    @{ folder = "drawable-land-mdpi";   w = 480;  h = 320 },
    @{ folder = "drawable-land-xhdpi";  w = 1280; h = 720 },
    @{ folder = "drawable-land-xxhdpi"; w = 1600; h = 960 },
    @{ folder = "drawable-land-xxxhdpi";w = 1920; h = 1280 },
    @{ folder = "drawable-port-hdpi";   w = 480;  h = 800 },
    @{ folder = "drawable-port-mdpi";   w = 320;  h = 480 },
    @{ folder = "drawable-port-xhdpi";  w = 720;  h = 1280 },
    @{ folder = "drawable-port-xxhdpi"; w = 960;  h = 1600 },
    @{ folder = "drawable-port-xxxhdpi";w = 1280; h = 1920 }
)

foreach ($s in $splashSizes) {
    $folder = $s.folder
    $w = $s.w
    $h = $s.h
    Resize-Icon -sourcePath $splashPath -destPath "$resDir\$folder\splash.png" -width $w -height $h -bgColorHex "#120F0E" -paddingRatio 0.0
}

# Generate web app icons for PWA/public
Resize-Icon -sourcePath $logoPath -destPath "C:\AMAX APP\amax craftapp\amax craft main\public\app-icon-192.png" -width 192 -height 192 -bgColorHex "#FFF9F0" -paddingRatio 0.10
Resize-Icon -sourcePath $logoPath -destPath "C:\AMAX APP\amax craftapp\amax craft main\public\app-icon-512.png" -width 512 -height 512 -bgColorHex "#FFF9F0" -paddingRatio 0.10

Write-Host "All Android icons and splash screens updated successfully!"
