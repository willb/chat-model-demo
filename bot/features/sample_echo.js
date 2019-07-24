/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var rp = require('request-promise');

module.exports = function(controller) {

    controller.hears('sample','message', async(bot, message) => {
        await bot.reply(message, 'I heard a sample message.');
    });

    controller.on('message', async(bot, message) => {
        var endpoint = process.env.ENDPOINT;
        json_args = '"' + message.text.replace(/[\\$"]/g, "\\$&") + '"';
        console.log('args are:  ' + json_args);
        if(endpoint) {
            var options = {
              method: 'POST',
              url: endpoint,
              headers: {'content-type': 'application/x-www-form-urlencoded'},
              form: {
                json_args: json_args
              }
            };

            var response = "";
            
            await rp(options).then(
                async(body) => {
                    console.log(body);
                    response = String('entities were: ' + String(body));
                }
              ).error(
                async(error) => {
                    response = 'I got an error, but your message was: ' + message.text;
                }
              );
              console.log("response is:  " + response);
              
              await bot.reply(message, String(response)); 
            
        } else {
            await bot.reply(message, 'message was: ' + message.text);
        }
    });

}
