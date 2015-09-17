var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:admfms@localhost:5432/fixmystreet';

pg.connect(connectionString, function(err, client, done) {
	console.log(client);
	console.log(err);
});
