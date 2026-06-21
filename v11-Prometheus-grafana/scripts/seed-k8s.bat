@echo off
echo === Synchronisation MongoDB local vers Kubernetes ===

REM Recupere le nom du pod mongo
for /f "tokens=*" %%i in ('kubectl get pod -l app=mongo -n %1 -o jsonpath^="{.items[0].metadata.name}"') do set MONGO_POD=%%i
echo Pod MongoDB: %MONGO_POD%

REM Execute le seed via mongosh
kubectl exec %MONGO_POD% -n %1 -- mongosh portfolio --quiet --eval "var src=new Mongo('host.docker.internal:27017').getDB('portfolio');var dst=db.getSiblingDB('portfolio');var cols=['projets','formations','certifications','experiences','competences'];for(var i=0;i<cols.length;i++){var col=cols[i];var docs=src.getCollection(col).find().toArray();if(docs.length>0){dst.getCollection(col).drop();dst.getCollection(col).insertMany(docs);print(col+': '+docs.length+' docs');}else{print(col+': vide');}};print('Seed OK');"

echo === Seed termine ===
