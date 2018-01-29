'use strict';

///////////////////////////////////////////////////////////
// imports dependencies and sets up http server via express
///////////////////////////////////////////////////////////

const
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()), // creates express http server
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log(' (((((((( WEBHOOK IS LISTENING )))))))) '));

//////////////////////////////////////////////
// creates the endpoint for our webhook
/////////////////////////////////////////////

app.post('/webhook', (req, res) => {

  let body = req.body;

  // checks this is an event from a page subscription
  if (body.object === 'page') {

    // iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log(' (((((((( SENDER PSID: ' + sender_psid + ' )))))))) ');

    });

    // returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

/////////////////////////////////////////////////
// adds support for GET requests to our webhook
/////////////////////////////////////////////////

app.get('/webhook', (req, res) => {

  // your verify token. Should be a random string.
  const VERIFY_TOKEN = "7gulC1QfabXA0tqvxi8G58d1uytym1BMUfjWrZwLju2lLwZlFuuhE1GwZiGb";

  // parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // checks if a token and mode is in the query string of the request
  if (mode && token) {

    // checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // responds with the challenge token from the request
      console.log(' (((((((( WEBHOOK VERIFIED )))))))) ');
      res.status(200).send(challenge);

    } else {
      // responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// handles messages events
function handleMessage(sender_psid, received_message) {

}

// handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {

}

// sends response messages via the Send API
function callSendAPI(sender_psid, response) {

}