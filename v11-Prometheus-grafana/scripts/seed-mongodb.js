const src = new Mongo('host.docker.internal:27017').getDB('portfolio');
const dst = db.getSiblingDB('portfolio');
const collections = ['projets','formations','certifications','experiences','competences'];

collections.forEach(function(col) {
  const docs = src.getCollection(col).find().toArray();
  if (docs.length > 0) {
    dst.getCollection(col).drop();
    dst.getCollection(col).insertMany(docs);
    print(col + ': ' + docs.length + ' documents synchronises');
  } else {
    print(col + ': vide (skip)');
  }
});

print('Seed termine.');
