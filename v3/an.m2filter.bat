@echo off

cd user
"C:\Program Files\7-Zip\7z.exe" u -up0q0r2x2y2z1w2 -tzip an.all.user.zip *.js

cd ..\opera
"C:\Program Files\7-Zip\7z.exe" u -up0q0r2x2y2z1w2 -tzip an.all.opera.zip *.js

cd ..\privoxy
"C:\Program Files\7-Zip\7z.exe" u -up0q0r2x2y2z1w2 -tzip an.privoxy.zip *.action *.filter

cd ..\m2filter\src
"C:\Program Files\7-Zip\7z.exe" u -up0q0r2x2y2z1w2 -tzip ..\an.m2filter.m2f Helianthus.Annuus\FileCacher Helianthus.Annuus\Scripts\*.js Helianthus.Annuus.xml

pause