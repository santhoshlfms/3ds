var request = require("request");

var options = { method: 'POST',
  url: 'https://svcs.sandbox.paypal.com/AdaptiveAccounts/GetVerifiedStatus',
  secureProtocol: 'TLSv1_1_method',

  headers: 
   { 'postman-token': '9ec4162c-252e-96ea-5569-b82f683631e8',
     'cache-control': 'no-cache',
     'content-type': 'application/json',
     'x-paypal-response-data-format': 'JSON',
     'x-paypal-request-data-format': 'JSON',
     'x-paypal-security-signature': 'AIzDgTVC6G3tDV3oaLTUr405xsenAmDU0AYb9v9oD4x3eWSlSIvBfxPu',
     'x-paypal-sandbox-email-address': 'sb-qqq9c6580744@business.example.com',
     'x-paypal-application-id': 'APP-80W284485P519543T',
     'x-paypal-security-password': 'Q2LHHAVUJK43DCQT',
     'x-paypal-security-userid': 'sb-qqq9c6580744_api1.business.example.com' },
  body: 
   { requestEnvelope: { detailLevelCode: 'ReturnAll', errorLanguage: 'en_US' },
     matchCriteria: 'NONE',
     emailAddress: 'san-cab-test1@pp.com' },
  json: true };

request(options, function (error, response, body) {
  if (error) {
      console.log(error)
  }

  console.log(body);
});