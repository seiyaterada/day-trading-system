const express = require('express'); // set up express for routing
const app = express(); 

/*
function cache(req, res, next) {
  const { username } = req.params;

  client.get(username, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      res.send(setResponse(username, data));
    } else {
      next();
    }
  });
}
*/

// app.get ('/quote/:userid', cache, getQuoteInfo)
// module.exports = app;