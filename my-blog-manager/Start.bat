@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo [??] my-blog-manager...

python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [??] ???????...
    set PYTHONIOENCODING=utf-8
    set PYTHONUTF8=1
    python run_me.py
    if %errorlevel% neq 0 (
        echo ????????
        pause
        exit /b 1
    )
    goto end
)

echo ?????? Python ??
pause

:end
echo ????
exit /b 0
