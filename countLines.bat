@echo off
echo.
setlocal enabledelayedexpansion
set /a totalLines=0
set "baseDir=%cd%"
for /R %%a in (*.*) do (
    rem Exclude files in the 'img' and 'sample' subdirectories
    set "filePath=%%a"
    if "!filePath:%baseDir%\img\=!"=="!filePath!" if "!filePath:%baseDir%\sample\=!"=="!filePath!" if "!filePath:%baseDir%\doc\=!"=="!filePath!" if "!filePath:%baseDir%\data\=!"=="!filePath!" (
        call :countFileLines "%%a"
    )
)
set totalLines="                   %totalLines%
echo     ---------------------------------------------------
echo     Total Lines:                      %totalLines:~-17%
echo.
echo.
pause
endlocal
goto :eof

:countFileLines
set "fullPath=%~1"
set "relPath=!fullPath:%baseDir%\=!"
for /F %%c in ('type "%~1" ^| find /c /v "AABBCC"') do set fileLines=%%c
set "fileName=!relPath!                              "
set /a totalLines+=fileLines
set "fileLines=          %fileLines%"
echo     !fileName:~0,40! !fileLines:~-10!
goto :eof
