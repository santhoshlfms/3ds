var express = require('express');
var request = require('request');

var router = express.Router();
 //clientId : 'AU38yVtT7uX_FPZgOvWXdIIewAFGP_K2DSvi6cfjyyg3pxgjKMGFABRX5bKSxV_FJbDcNG4XCFcyQimX',
  //secret : 'EEq7udV_b-1NacvOQ_HXhWGdpiNdU6KfhZiHuXQqDfgw5ag5ex-zFwFzyOb6SNM41klRqqRvZ21d8X7x',

  // clientId: 'AV0j4Cy-JcLGbXtda6njQMGvxija6uesTWhMNEtPQFX6UW0TBqW4EX9i1PYjBh7Puj6rGiQlwScs0ANa',
  //aus account
  //secret:'EFBArdMGROuf7w_1dbIWdO50mWWvmI1rAmdLbfeVt-VA2bNloG2oXni6G_B_9QJo05E2H4XjxId5TZBf',

  // muru
 //
//
let config = {
  clientId: 'AZaYyzkzdpoNudMiDSwMNlGck9MEy5ufiFz5QKfgZkKWvwhPe5PobRY_tybgy5Pau9bbRZbQoxqw2GMc',
  secret:'EED02t6KClDtBAvfhY699KFXUJbvEZGY9NMjfCVbIvs2nI4SOmRisOMVUeDs34Ljz85OcLSNitx1-xPn',
  email: 'merchant-us-san@pp.com',
  url:'https://api.paypal.com'
}



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/msp', function(req, res, next) {
  res.render('msp', { title: 'Express' });
});

router.get('/acdc', function(req, res, next) {
  generateClientToken(function(response) {
     console.log(response && response.client_token)
    
     res.render('acdc', { title: 'Advanced cards', clientToken: response.client_token });  
   })
 
});

router.get('/success', function(req, res, next) {
  res.render('success', { title: 'Express' });
});

router.get('/advanced_cards', function(req, res, next) {
  generateClientToken(function(response) {
   // console.log(response && response.client_token)
    res.render('advance_cards', { title: 'Advanced cards', clientToken: response.client_token });  
  })
});

router.get('/cards', function(req, res, next) {
  res.render('credit_cards', { title: 'Express' });
});

router.post('/seller-server/login-seller', function(req, res, next) {
  console.log("seller-server/login-seller --- muru")
  console.log(req.body)
  res.json({status: "ok"});
});


router.post('/create-payments', function(req, res, next) {
  let amount = 0.10;
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
    console.log("-------------------")
    console.log(JSON.stringify(payload))
    console.log("-------------------")
    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.json(response.body);
    });
  })
});



router.post('/create-payments-msp', function(req, res, next) {
  let payload = req.body
  console.log(JSON.stringify(payload))
  getAccessToken(function(tokenResp){
    let acccessToken = JSON.parse(tokenResp).access_token
   //let payload = createPaymentPayload(amount);
    var options = {
      'method': 'POST',
      'url': config.url+'/v2/checkout/orders',
      'headers': {
        'Authorization': 'Bearer '+acccessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    
    };
    console.log("-------------------")
    console.log(JSON.stringify(payload))
    console.log(JSON.stringify(options))
    console.log("-------------------")
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
    console.log(options)
    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.json(response.body);
    });
    
  });
});

router.post('/get-order-details', function(req, res, next) {
  let orderId = req.query.orderId;
  getAccessToken(function(tokenResp){
    let acccessToken = JSON.parse(tokenResp).access_token;
    var options = {
      'method': 'GET',
      'url': config.url+'/v2/checkout/orders/'+orderId,
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
      'response_type': 'token',
      'ignoreCache' : true
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(JSON.stringify(response.body))
    cb(response.body);
  });
}


function createPaymentPayload(amount) {
  return {
    "intent":"CAPTURE",
    "application_context": {"shipping_preference": "NO_SHIPPING"},
    "purchase_units":[
       {
          "amount":{
             "currency_code":"USD",
             "value":amount
          },
          "payee": {
            "email_address": "hktim.pp@gmail.com"
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
      },
      body: JSON.stringify({"customer_id": "MURUSANTHOSHTEST1"})
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      //console.log(response)
      cb(JSON.parse(response.body));
    });
    
  });
}

module.exports = router;
