/**
 * 工具函数
 * Utility Functions
 */

var constants = require('./constants.js');
var TROUBLESHOOTING_LINK = constants.TROUBLESHOOTING_LINK;

function buildResult(message) {
    return {
        "from": "en",
        "to": "zh-Hans",
        "toParagraphs": [message],
        "fromParagraphs": ["success add to word book"]
    };
}

function buildError(message) {
    return {
        'type': 'param',
        'message': message,
        'addtion': '无'
    };
}

function buildValidationError(message, link) {
    return {
        result: false,
        error: {
            type: "secretKey",
            message: message,
            troubleshootingLink: link || TROUBLESHOOTING_LINK
        }
    };
}

module.exports = {
    buildResult: buildResult,
    buildError: buildError,
    buildValidationError: buildValidationError
};
