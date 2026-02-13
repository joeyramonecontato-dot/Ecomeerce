@echo off
echo Iniciando Chrome em Modo BOT (Perfil Isolado)...
echo.
echo ATENCAO:
echo 1. Uma nova janela do Chrome vai abrir.
echo 2. Ela estara "zerada" (sem senhas salvas do seu pai).
echo 3. Faca o LOGIN na SUA conta da Amazon nessa janela.
echo 4. Nao feche essa janela! O robo vai usar ela.
echo.
start "" chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\ChromeDevSession"
exit
