var express = require('express');
var request = require('request');

var router = express.Router();

let config = {
  clientId : 'AU38yVtT7uX_FPZgOvWXdIIewAFGP_K2DSvi6cfjyyg3pxgjKMGFABRX5bKSxV_FJbDcNG4XCFcyQimX',
  secret : 'EEq7udV_b-1NacvOQ_HXhWGdpiNdU6KfhZiHuXQqDfgw5ag5ex-zFwFzyOb6SNM41klRqqRvZ21d8X7x',
  email: 'merchant-us-san@pp.com',
  url:'https://api.sandbox.paypal.com'
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/success', function(req, res, next) {
  res.render('success', { title: 'Express' });
});

router.get('/advanced_cards', function(req, res, next) {
  generateClientToken(function(response) {
    console.log(response && response.client_token)
    res.render('advance_cards', { title: 'Advanced cards', clientToken: response.client_token });  
  })
});

router.get('/cards', function(req, res, next) {
  res.render('credit_cards', { title: 'Express' });
});


router.post('/create-payments', function(req, res, next) {
  let amount = 10.00;
  getAccessToken(function(tokenResp){
    let acccessToken = JSON.parse(tokenResp).access_token
    let payload = createPaymentPayload(amount);
    var options = {
      'method': 'POST',
      'url': config.url+'/v2/checkout/orders',
      'headers': {
        'Authorization': 'Bearer '+acccessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.json(response.body);
    });
  })
});


router.post('/capture-order', function(req, res, next) {
  let orderId = req.query.orderId;
  getAccessToken(function(tokenResp){
    let acccessToken = JSON.parse(tokenResp).access_token;
    var options = {
      'method': 'POST',
      'url': config.url+'/v2/checkout/orders/'+orderId+'/capture',
      'headers': {
        'Authorization': 'Bearer '+acccessToken,
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.json(response.body);
    });
    
  });
});


function getAccessToken(cb) {
  var token  = config.clientId+":"+config.secret,
	    encodedKey = new Buffer(token).toString('base64');
  var options = {
    'method': 'POST',
    'url': config.url+'/v1/oauth2/token',
    'headers': {
      'Authorization': 'Basic '+ encodedKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
      'grant_type': 'client_credentials',
      'response_type': 'token'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
   
    cb(response.body);
  });
}


function createPaymentPayload(amount) {
  return {
    "intent":"CAPTURE",
    "purchase_units":[
       {
         
          "amount":{
             "currency_code":"USD",
             "value":amount
          }
       }
    ]
 }
 
}


function generateClientToken(cb){
  getAccessToken(function(tokenResp){
    let acccessToken = JSON.parse(tokenResp).access_token;
    var options = {
      'method': 'POST',
      'url': config.url+'/v1/identity/generate-token/',
      'headers': {
        'Authorization': 'Bearer '+acccessToken,
        'Content-Type': 'application/json'
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response)
      cb(JSON.parse(response.body));
    });
    
  });
}

module.exports = router;
