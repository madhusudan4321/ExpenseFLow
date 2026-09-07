@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@if "%MAVEN_BATCH_ECHO%"=="on" echo %MAVEN_BATCH_ECHO%
@setlocal

@set MAVEN_PROJECTBASEDIR=%~dp0
@if "%MAVEN_PROJECTBASEDIR:~-1%"=="\" set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

@set MAVEN_WPR_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar

@REM Find JAVA_HOME
@if not "%JAVA_HOME%"=="" goto valJavaHome

:findJavaFromPath
@set JAVA_EXE=java.exe
@for %%i in (%JAVA_EXE%) do @set JAVA_EXE_FULL=%%~$PATH:i
@if not "%JAVA_EXE_FULL%"=="" goto execute

@echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH. >&2
@goto error

:valJavaHome
@set JAVA_EXE="%JAVA_HOME%\bin\java.exe"
@if exist %JAVA_EXE% goto execute
@set JAVA_EXE=java.exe

:execute
@if exist "%MAVEN_WPR_JAR%" goto runWrapper

@echo Downloading Maven Wrapper JAR...
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar' -OutFile '%MAVEN_WPR_JAR%'"

:runWrapper
%JAVA_EXE% -classpath "%MAVEN_WPR_JAR%" "-Dmaven.home=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" org.apache.maven.wrapper.MavenWrapperMain %*
@if ERRORLEVEL 1 goto error

@goto end

:error
@set ERRORCODE=1

:end
@exit /b %ERRORCODE%
