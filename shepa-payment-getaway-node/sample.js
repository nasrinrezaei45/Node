const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 2500;

const Shepa = require('./shepa');
const gateway = new Shepa('sandbox'); // for test

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req, res) {

    gateway.send(1000, 'http://localhost:' + port + '/verify', "9123333333", 'info@shepa.com', "توضیحات در سندباکس الزامی است")
        .then(link => res.redirect(link))
        .catch(error => res.end("<head><meta charset='utf8'></head>" + error));
});

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

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});
