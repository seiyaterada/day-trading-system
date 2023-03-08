brew install redis
redis-server
npm init -y
npm i express node-fetch redis


## downgrade node-fetch to 2.6.6 to use require()
sudo npm install node-fetch@^2.6.6

## run the app
sudo npm run