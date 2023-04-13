# day-trading-system
This is an implementation of a highly scalable day trading application utilizing tools such as caching and load balancing.
## Getting Started
<p>To get started with the application first clone the repository using
<code>git clone</code></p>
<p>
Run <code>docker-compose up --build --scale transact=n</code> where n is the number of transaction servers you want started up which will spin up
all the containers needed for the application</p>

### Command Line
<p>Running the command line interface to test commands can be done by follwing these steps:</p>
1. switching into the <code>bin</code> folder with <code>cd command-line-app/bin</code>
2. <code>npm install</code>
3. <code>ts-node index.ts</code>

## Architecture
![architecture](https://user-images.githubusercontent.com/54200250/231621622-319bddfc-8787-4c3b-8ca2-14ffebe2d3c9.png)

## Performance
