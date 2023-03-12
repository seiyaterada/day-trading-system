import pymongo
import time
debug = True
makeChanges = True
time.sleep(5) #making sure the DB is up and running before i attack it
if debug==True:
	print("initiating")
client = pymongo.MongoClient("mongodb://DBContainer") #the connection to the DB
db = client["users"] #use db named "users"

#every user is a collection, and the contents of every collection 
##are the transactions done by that user
##so, for every new user, we have to select the collection and then add the command
#transactions that have to be logged in the db are few:
##ADD, BUY, SELL
##the automated buy/sell commands are held somewhere else, but will store BUY/SELL in the
##DB when they complete
#***the DB is only for completed actions where something has occurred***
#below are examples of the three commands being used

if makeChanges==True:
	#add
	##received input of (ADD,jsmith,200.00)
	user = "jsmith"
	operation = "ADD"
	amount = 200.00
	transaction = db[user]
	x = transaction.insert_one({"operation": operation, "amount": amount})

	#buy
	##received input of (BUY,jsmith,ABC,200.00)
	user = "jsmith"
	operation = "BUY"
	target = "ABC"
	amount = 200.00
	transaction = db[user]
	x = transaction.insert_one({"operation": operation, "target": target, "amount": amount})

	#sell
	##received input of (SELL,jsmith,ABC,100.00)
	user = "jsmith"
	operation = "SELL"
	target = "ABC"
	amount = 100.00
	transaction = db[user]
	x = transaction.insert_one({"operation": operation, "target": target, "amount": amount})

	#further testing
	user = "test"
	operation = "ADD"
	amount = 200.00
	transaction = db[user]
	x = transaction.insert_one({"operation": operation, "amount": amount})

#this is a rudimentary DUMP call, it dumps to stdout
#for every collection (user) print all of their logs
for collections in db.list_collection_names():
	print("user:{}".format(collections))
	for log in db[collections].find():
		#length 3 is add commands, which dont have targets
		if len(log)==3:
			print(log["operation"]+" "+str(log["amount"]))
		else:
			print(log["operation"]+" "+log["target"]+" "+str(log["amount"]))

if debug==True:
	print("finished")