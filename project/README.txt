The database is initialized with the docker compose file
to start it up, path to the download directory and put in:
	docker-compose up --build
which will initialize both the DB and some basic simulation of how to use it

the DB uses a volume to track stuff, booting it up over and over is a pain
so to avoid that, booting up only the transaction server side:
	docker-compose up --build transact

because the DB is persistent, and the main DB idea is append only,
running the python code will fill it up, so there is a flag at the top of
transact.py called "makeChanges" which you can turn off to stop adding things

transact.py shows how an add, buy, sell, or dump call can be made to the DB
in theory, these are the only calls that will ever be made to the DB:
calls such as targeted buys will be stored serverside until they run, 
which would THEN create a buy call to the DB

Again, the DB should only store completed actions, not actions waiting to be completed

if the project is running, the mongoDB will stay online indefinitely,
and you can jump into it to check it out without scripting code:
	docker exec -it DBContainer bash
will start a terminal in the mongo container, and from there
	mongosh
will open the terminal mongo interface
try commands like
	show dbs
	use users - the database
	show collections - all the users that have made transactions
	db.COLLECTIONNAME.find() - print out all transactions of that user

when you're ready to take it down, you can stop the database with
	docker stop DBContainer
this will not clear the memory taken up by it, which is
considerable
you can fully clear the project out by going through these:
	docker container prune
	docker image prune
	docker volume prune
	docker network prune
and then from there, if you want to fully purge an image:
	docker image ls -a
and then use the names there in
	docker rmi NAME
to fully delete them

mess around with it and get back to me!