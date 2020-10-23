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
 
  clientId: 'Aa_h6z8ib3U69GzYw23SKuG-1g_PSNJouUp2bGdd-pD5xiMCsrcUV_xg5njOBKdvlc-LyLBx8oqEfhZ5',
  secret:'ECieAQqRDYFSnrpuRRCOzVogt1nRJAMUIolOGfsWaJpVp-LBEiOYT-ReC97yLy4CCKs1dAJDu5fnBZLl',
  email: 'merchant-us-san@pp.com',
  url:'https://api.sandbox.paypal.com'
}


let config1 = {
 
  clientId: 'AdKMv_n2isOtb_QNSR4QEbO6CirDuRiAMJse4HEZTr5E5GE-L3Utg3cEcFhxADm-apr-_rX8z4IufFBD',
  secret:'EAPCWsOxv7zuH6vCFj6pXwgV6CeeGV5PgkAXufO32tkHX4usbEMt5F1x6zgRDzawbjm3hMBof0g0Rxgv',
  email: 'partner-us-san@pp.com',
  url:'https://api.sandbox.paypal.com'
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/msp', function(req, res, next) {
  res.render('msp', { title: 'Express' });
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
   
    cb(response.body);
  });
}


function createPaymentPayload(amount) {
  return {
    "intent":"CAPTURE",
    "purchase_units":[
       {
         
          "amount":{
             "currency_code":"INR",
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
      //console.log(response)
      cb(JSON.parse(response.body));
    });
    
  });
}

module.exports = router;
