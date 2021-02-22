# 📦 Shepa.com Node.js Module


By using this package, you'll be able to work with Shepa.com REST Api in Node.js (Back-End) without any problem! This package is usable for all Node.js Frameworks such as Express.js, Hapi.js, Sails.js, Adonis.js or others.

This package uses ECMASCRIPT 6 features so make sure that your Node.js version supports it.

# First step, Installation and Initialization

First of all, install the module with NPM command:

```sh
$ npm install shepa-payment-getaway --save
``` 

Then, create an instance of Payir class and pass your Gateway API KEY to it:

```js
const Shepa = require('./shepa');
const gateway = new Shepa('YOUR API KEY|sandbox'); 
```

# Second step, Send Request

## `send` Method:

After initializing, you should send a payment request in order to receive the `transId` and redirect user to the Bank.

Hopefuly, you can get rid of the Callback functions by using Promises:

```js
app.get('/', (req, res) => {
     gateway.send(1000, 'http://localhost:' + port + '/verify', "9123333333", 'info@shepa.com', "توضیحات در سندباکس الزامی است")
        .then(link => res.redirect(link))
        .catch(error => res.end("<head><meta charset='utf8'></head>" + error));
});
```

First parameter is `amount` of the transaction, the second one is your `callback URL` and the third one is the `mobile` (optional) and the third one is the `email` (optional) and the third one is the `description` (optional).

If operations are done successfully, you'll have access to payment URL in `then`, otherwise you can read error message in `catch`.

The error message might be a Farsi text; Therefore, make sure your page supports UTF-8 encoding.

# Third step, Verify Request

## `verify` Method:

When user perform the transaction, it will redirect to your callback URL, so you should verify that in a POST route.

The only parameter of the `verify` method is your POST request body. There are differences between Node.js web frameworks so you should pass it accurate. For example:

```js
// How to access to POST data

// Express.js
console.log(request.body.var_name);
// Hapi.js
console.log(request.payload.var_name);
```

So in `express.js` framework we will have:

```js
app.get('/verify', function (req, res) {
	
    // Pass POST Data Payload (Request Body) to verify transaction
    var token = req.query.token;
    var status = req.query.status;
	if(status == "success") {
		gateway.verify(token, 1000)
			.then((data) => {
				if (status === 0) {
					res.end(data.msg);
				} else {
					console.log(data);
					console.log('Transaction ID: ' + data.transId);
					console.log('Transaction Amount: ' + data.amount);
					res.end('Payment was successful.\nCheck the console for more details.');
					console.log('-----------------------------------------------\n\n');
				}
			})
			.catch(error => res.end("<head><meta charset='utf8'></head>" + error));
	}
	else{
		res.end('payment cancel');
		console.log("payment cancel");
	}
	
});
```

When transaction is done,  `then` will have an input object that contains following values:

|      Key      	|                            Description                           	|
|:-------------:	|:----------------------------------------------------------------:	|
|     refid    	    |              The refid of transaction 	                        |
|    transId                   The unique id of the transaction                   	    |
|     amount    	|                     The amount of transaction                    	|
|   cardNumber  	|                      The User's bank card number                  |

# Sandbox Mode

By using `sandbox` string instead of your gateway API Key, you can test your code.

# Sample

If you need a sample code, you can take a look at `sample.js` file.

# License

This package is under Apache 2.0 license.