var https = require('https');

var BotFather = (function () {

    var BotFather = function(token) {
        this.token = token;
    }

    BotFather.prototype.api = function() {

        // method
        if(typeof arguments[0] != 'string') {
            throw new Error('First argument must be a string');
        }
        var method = arguments[0];

        // parameters
        var parameters;
        if(typeof arguments[1] == 'object') {
            parameters = arguments[1];
        } else {
            parameters = {};
        }
        parameters = require('querystring').stringify(parameters);
        
        // callback
        var callback;
        if(typeof arguments[1] == 'function') {
            callback = arguments[1];
        }

        // request
        var options = {
            host: 'api.telegram.org',
            port: 443,
            path: '/bot' + this.token + '/' + method,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(parameters)
            }
        };
        var request = https.request(options, function(response) {

            var data = '';
            response.on('data', (chunk) => {
                data += chunk
            });
            response.on('end', () => {
                if(typeof callback == 'function') {
                    try {
                        data = JSON.parse(data);
                        callback(null, data);
                    } catch(exception) {
                        callback(exception);
                    }
                }
            });
        });
        request.write(parameters);
        request.end();

    };

    BotFather.prototype.getMe = function(callback) {
        this.api('getMe', callback);
    }

    return BotFather;

})();

module.exports = BotFather;