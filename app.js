var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var app = express()
var token = "CAADO2v94la0BAIK5788ksRiri79FcnhUrcftVPHzB5g5yYiZCMJRQA1RL4nkV6ONqvC8BpkeeRaEjhqe3uDdFuRmCRbnLUU0ZCXpHfsflsETKwh0EZAvc5z7fhFysBmRA80sTjjMDWRsSjZA3pZB9q2grLCYm0TAXd5akLJTZCJGkZBE7CPFh5m2fyb1kCHttsZD";

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World!')
})
// webhook FB developer
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '1234') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var text = event.message.text;
      console.log(text);

     
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
      // Handle a text message from this sender
      // sendTextMessage(sender, search);
    }
  }
  res.sendStatus(200);
});

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function () {
  console.log('Example aoo listening on port ' + app.get('port') + ' !')
})



function sendTextMessage(sender, text) {
  var messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
