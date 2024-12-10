const ClientError = require('./ClientError');

class InputError extends ClientError {
    constructor(message) {
        super(message, 422); // 422 Unprocessable Entity
        this.name = 'InputError';
    }
}

module.exports = InputError;
