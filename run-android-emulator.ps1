# Lambert Parking - run on Android emulator
# One-time: run install-hypervisor-driver.ps1 as Administrator first

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$AndroidSdk = "C:\Android\Sdk"
$AvdName = "LambertParking"
$ApkPath = Join-Path $ProjectRoot "platforms\android\app\build\outputs\apk\debug\app-debug.apk"

$env:ANDROID_HOME = $AndroidSdk
$env:Path = "$AndroidSdk\platform-tools;$AndroidSdk\emulator;" + $env:Path

Write-Host "Checking emulator acceleration..."
& "$AndroidSdk\emulator\emulator.exe" -accel-check
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR: Hardware acceleration is not available."
    Write-Host "Run this once as Administrator:"
    Write-Host "  $ProjectRoot\install-hypervisor-driver.ps1"
    exit 1
}

Write-Host "Starting emulator '$AvdName'..."
Start-Process -FilePath "$AndroidSdk\emulator\emulator.exe" -ArgumentList "-avd",$AvdName,"-gpu","swiftshader_indirect"

Write-Host "Waiting for emulator to boot..."
adb wait-for-device
for ($i = 0; $i -lt 60; $i++) {
    $boot = (adb shell getprop sys.boot_completed 2>$null).Trim()
    if ($boot -eq "1") { break }
    Start-Sleep -Seconds 5
}

if (-not (Test-Path $ApkPath)) {
    Write-Host "APK not found. Build first with: npm run build && cordova prepare android && gradle assembleDebug"
    exit 1
}

Write-Host "Installing app..."
adb install -r -g -t $ApkPath
Write-Host "Launching Lambert Parking..."
adb shell am start -n com.BCS.LambertParking/.MainActivity
Write-Host "Done."
