@echo off
REM Script para actualizar carreras en Supabase
REM Ejecutar en terminal con Node.js instalado

set SUPABASE_URL=https://ssyljhtganuaanczxeep.supabase.co
REM La clave se lee de la variable de entorno SUPABASE_SERVICE_KEY (no la escribas aqui)
set SERVICE_KEY=%SUPABASE_SERVICE_KEY%

echo Actualizando carreras Spartan...
curl -X PATCH "%SUPABASE_URL%/rest/v1/races?modalidad_id=ilike.%25spartan%25" ^
  -H "apikey: %SERVICE_KEY%" ^
  -H "Authorization: Bearer %SERVICE_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https:\/\/es.spartan.com\/es\/races\",\"formato\":\"Individual\",\"precio\":\"Desde 99€\"}"

echo.
echo Actualizando carreras Tough Mudder...
curl -X PATCH "%SUPABASE_URL%/rest/v1/races?modalidad_id=ilike.%25mudder%25" ^
  -H "apikey: %SERVICE_KEY%" ^
  -H "Authorization: Bearer %SERVICE_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https:\/\/toughmudder.com\/es\",\"formato\":\"Individual\",\"precio\":\"Desde 89€\"}"

echo.
echo Actualizando carreras HYROX...
curl -X PATCH "%SUPABASE_URL%/rest/v1/races?modalidad_id=ilike.%25hyrox%25" ^
  -H "apikey: %SERVICE_KEY%" ^
  -H "Authorization: Bearer %SERVICE_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https:\/\/hyrox.com\",\"formato\":\"Individual\",\"precio\":\"Desde 69€\"}"

echo.
echo Actualizando carreras CrossFit...
curl -X PATCH "%SUPABASE_URL%/rest/v1/races?modalidad_id=ilike.%25crossfit%25" ^
  -H "apikey: %SERVICE_KEY%" ^
  -H "Authorization: Bearer %SERVICE_KEY%" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\":\"https:\/\/crossfit.com\",\"formato\":\"Individual\"}"

echo.
echo Completado!
pause