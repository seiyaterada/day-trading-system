const {MongoClient} = require("mongodb");
var client;
async function main(url) {
	try {
		const url = "mongodb://DBContainer";
		client = new MongoClient(url);
		await client.connect();
		await listDatabases(client);
	} catch (e) { 
		console.error(e)
	} finally {
		await client.close();
	}
}

async function listDatabases(client){
	databasesList = await client.db().admin().listDatabases();
	console.log("Databases:");
	databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
main().catch(console.error)
