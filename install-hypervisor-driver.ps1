# Run this script as Administrator (one-time setup for Android emulator)
$DriverPath = "C:\Android\Sdk\extras\google\Android_Emulator_Hypervisor_Driver\silent_install.bat"
if (-not (Test-Path $DriverPath)) {
    Write-Host "Hypervisor driver not found. Install via Android SDK Manager first."
    exit 1
}
Write-Host "Installing Android Emulator Hypervisor Driver..."
& $DriverPath
Write-Host "Done. Reboot if prompted, then run: .\run-android-emulator.ps1"
