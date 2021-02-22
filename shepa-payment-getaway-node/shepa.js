/**
 * shepa.com Node.js Module
 * @module shepa.com
 * @author Amin Soltani <asolatni927[at]gmail.com>
 * @copyright shepa.com 2019
 * @version 1.0.0
 * @license Apache-2.0
 */

/** shepa.com Class */
class Shepa {

    /**
     * Get the API Key
     * @throws Will throw an error if the API isn't string.
     * @param type
     */

    url(type = '') {
        if (this.api === 'sandbox')
            return 'https://sandbox.shepa.com/api/v1/' + type;
        else
            return 'https://merchant.shepa.com/api/v1/' + type;
    }

    /**
     * Get the API Key
     * @param {string} api Your gateway API Key.
     * @throws Will throw an error if the API isn't string.
     */
    constructor(api) {
        if (api !== '' && typeof api === 'string') {
            this.request = require('request');
            this.api = api;
            this.getTokenEndPoint = this.url('token'); // here is get token api
            this.verifyEndPoint = this.url('verify'); // here is verify api
            this.gateway = this.url(); // here is redirect to shepa gateway
        } else
            throw new Error('You should pass your shepa.com API Key to the constructor.');
    }

    /**
     * Build and prepare transaction URL
     * @param {number} amount Transaction's Amount
     * @param {string} callbackURL User will redirect to this URL to check transaction status
     * @param {string} [null] factorNumber Order ID or Invoice Number
     * @throws Will throw an error if URL building isn't successfull.
     */
    send(amount, callbackURL, mobile, email, desc) {
        const $this = this;
        mobile = mobile || null;
        email = email || null;
        desc = desc || null;
        return new Promise((resolve, reject) => {
            if (typeof amount !== 'number' || amount < 1000)
                throw new Error('Transaction\'s amount must be a number and equal/greater than 1000');
            else if (typeof callbackURL !== 'string' || callbackURL.length < 5)
                throw new Error('Callback (redirect) URL must be a string.');
            else if (callbackURL.slice(0, 4) != 'http')
                throw new Error('Callback URL must start with http/https');
            this.request.post({
                url: this.getTokenEndPoint,
                json: {api: $this.api, amount, callback: callbackURL, mobile: mobile , email: email, description: desc}
            }, (error, response, body) => {

                if (error)
                    reject(error.code);
                else if (body.success == true){
					resolve(this.gateway + body.result.token);			
				}
                else{ 
                    reject(body.error);
				}
            });
        });
    }

    /**
     *
     * @param trans
     * @param amount
     */
    verify(token, amount) {
        const $this = this;
        amount = parseInt(amount);

        return new Promise((resolve, reject) => {
            if (!amount || typeof amount !== 'number')
                throw new Error('Amount is not valid.');

            this.request.post({
                url: this.verifyEndPoint,
                json: {api: this.api, token: token, amount: amount}
            }, (error, response, body) => {

                if (error)
                    reject(error.code);
                else if (body.success == false)
					reject(body.error);
                else if (body.success == true){
					resolve({
						amount: body.result.amount,
						transId: body.result.transaction_id,
						refid: body.result.refid,
						cardNumber: body.result.card_pan,
					});
				}
            });
        });
    }
}

module.exports = Shepa;