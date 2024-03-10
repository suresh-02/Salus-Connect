REM stop
docker stop salusconnect_api
rem docker rm $(docker stop $(docker ps -a -q --filter ancestor=<image-name> --format="{{.ID}}"))

REM build
docker build -f SalusConnect.Api/Dockerfile -t tbalakpm/salusconnect-api:1.0.0 .
REM run
docker run --rm -d --env-file salusconnectapi.env -p 49450:80 --name salusconnect_api tbalakpm/salusconnect-api:1.0.0

rem -e "ConnectionStrings:DefaultConnection=Server=localhost;Database=salus_connect;UserID=dbadmin;Password=pPt47xTN0P;Application Name=SalusConnect"
rem -e "RedisCache.ConnectionString=localhost:6379,abortConnect=False"
REM inspect
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_id>
