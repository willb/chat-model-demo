/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var request = require('request');

module.exports = function(controller) {

    controller.hears('sample','message', async(bot, message) => {
        await bot.reply(message, 'I heard a sample message.');
    });

    controller.on('message', async(bot, message) => {
        var endpoint = process.env.ENDPOINT;
        if(endpoint) {
            request('http://' + endpoint, async(err, response, body) => {
                if(err) {
                    console.log('error: ', err);
                    await bot.reply(message, 'message was: ' + message.text);
                } else {
                    await bot.reply(message, 'endpoint is ' + process.env.ENDPOINT + '; message was: ' + message.text);            
                }
            });
        } else {
            await bot.reply(message, 'message was: ' + message.text);
        }
    });

}
