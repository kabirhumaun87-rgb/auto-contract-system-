@echo off
echo ========================================================
echo Auto Contract System - Windows PyInstaller Build Script
echo ========================================================

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    pause
    exit /b 1
)

echo [1/3] Installing/verifying required dependencies...
pip install -r requirements.txt
pip install pyinstaller

echo [2/3] Building executable using PyInstaller...
pyinstaller --noconfirm --clean auto_contract.spec

echo [3/3] Build process finished!
if exist "dist\Auto Contract System.exe" (
    echo [SUCCESS] Executable generated at: dist\Auto Contract System.exe
) else (
    echo [NOTICE] Check the dist/ directory for output files.
)

pause
