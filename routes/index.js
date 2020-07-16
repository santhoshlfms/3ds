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
          "reference_id":"sellerindia1@pp.com.com1_test_07062020",
          "amount":{
             "currency_code":"USD",
             "value":amount
          },
          "shipping":{
             "address":{
                "shipping_name":"Singpr William Woodbridge",
                "phone":"5104519373",
                "address_line_1":"4612  Thompson Drive",
                "address_line_2":"#100",
                "admin_area_2":"California",
                "admin_area_1":"T nagar",
                "postal_code":"94612",
                "country_code":"US"
             },
             "method":"USPS"
          }
       }
    ],
    "application_context":{
       "brand_name":"PRIXSOFT",
       "locale":"en-US",
       "landing_page":"LOGIN",
       "shipping_preference":"SET_PROVIDED_ADDRESS",
       "user_action":"PAY_NOW",
       "return_url":"https://www.google.com",
       "cancel_url":"https://www.yahoo.com"
    }
 }
 
}

module.exports = router;
