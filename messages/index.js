//var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

//=========================================================
// Bot Setup
//=========================================================


var connector = new botbuilder_azure.BotServiceConnector({
        appId: process.env['MicrosoftAppId'],
        appPassword: process.env['MicrosoftAppPassword'],
        stateEndpoint: process.env['BotStateEndpoint'],
        openIdMetadata: process.env['BotOpenIdMetadata']
    });

    module.exports = { default: connector.listen() }

// Setup Restify Server
//var server = restify.createServer();
//server.listen(process.env.port || process.env.PORT || 3978, function () {
   //console.log('%s listening to %s', server.name, server.url); 
//});
  
// Create chat bot
//var connector = new builder.ChatConnector({
  //  appId: process.env.MICROSOFT_APP_ID,
//    appPassword: process.env.MICROSOFT_APP_PASSWORD
//});
var bot = new builder.UniversalBot(connector);
//server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', function (session) {
    session.send("Hello World");
});