// This is my first coding

"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
//var jsonfile = require('jsonfile');

var file = '../hiscore.json';
var fileQuiz = '../quiz.json';
var obj;

var environment = process.env.NODE_ENV || 'development';
var useEmulator = (environment == 'development');
useEmulator = false;

console.log('Environment: %s', process.env.NODE_ENV);
console.log('Start with emulator: %s', useEmulator);

//var quizgame = jsonfile.readFileSync(fileQuiz);

var quizgame = { "quizgame": {
    "title" : "IKEA botquiz",
    "subtitle": "Subtitles",
    "description": "Description",
    "img": "http://www.ikea.com/ms/img/header/logo.gif",
    "rules": "The rules of the game are really simple! (wave) (heart)",
    "welcome": "Hi... I'm the IKEA gaming robot!",
    "goodbye": "Ok... Welcome back! Just type hello to wake me up again...",
    "levels": 
      [ 
        {
        "levelname": "Easy level",
        "nbrofquestions" : 5,
        "questions": 
          [
		{ "name": "BREIM", "image": "http://www.ikea.com/PIAimages/0291703_PE424963_S3.JPG"}, 
		{ "name": "SKUBB", "image": "http://www.ikea.com/PIAimages/0277256_PE416198_S3.JPG"},
		{ "name": "KUPOL", "image": "http://www.ikea.com/cn/en/images/products/kupol-castor-grey__0133605_PE289154_S4.JPG"},
		{ "name": "NORSBORG", "image": "http://www.ikea.com/PIAimages/0398539_PE564975_S3.JPG"},
		{ "name": "LISABO", "image": "http://www.ikea.com/PIAimages/0325067_PE523174_S3.JPG"}, 
		{ "name": "VEJMON", "image": "http://www.ikea.com/PIAimages/0307444_PE427864_S3.JPG"}, 
		{ "name": "ARKELSTORP", "image": "http://www.ikea.com/PIAimages/0260729_PE404586_S3.JPG"}, 
		{ "name": "BOKSEL", "image": "http://www.ikea.com/PIAimages/0119835_PE276267_S3.JPG"}, 
		{ "name": "STOCKHOLM", "image": "http://www.ikea.com/cn/en/images/products/stockholm-bedside-table-yellow__0177064_PE329944_S4.JPG"},
		{ "name": "FJÄLLA", "image": "http://www.ikea.com/PIAimages/0321583_PE515950_S3.JPG"}, 
		{ "name": "MÖRBYLÅNGA", "image": "http://www.ikea.com/PIAimages/0364486_PE548340_S3.JPG"}
          ]
        },
        {
        "levelname": "Level 2 - Medium level",
        "nbrofquestions" : 5,
        "questions": 
          [
            { "name": "STOCKHOLM", "image": "http://www.ikea.com/cn/en/images/products/stockholm-bedside-table-yellow__0177064_PE329944_S4.JPG"},
		   { "name": "STOCKHOLM", "image": "http://www.ikea.com/cn/en/images/products/stockholm-bedside-table-yellow__0177064_PE329944_S4.JPG"},
              { "name": "STOCKHOLM", "image": "http://www.ikea.com/cn/en/images/products/stockholm-bedside-table-yellow__0177064_PE329944_S4.JPG"},
                 { "name": "STOCKHOLM", "image": "http://www.ikea.com/cn/en/images/products/stockholm-bedside-table-yellow__0177064_PE329944_S4.JPG"},
                    { "name": "STOCKHOLM", "image": "http://www.ikea.com/cn/en/images/products/stockholm-bedside-table-yellow__0177064_PE329944_S4.JPG"}
          ]
        }
      ]
}};

var parsed = quizgame;
var quizTitle = parsed.quizgame.title;
var quizSubtitle = parsed.quizgame.subtitle;
var quizRules = parsed.quizgame.rules;
var quizImgURL = parsed.quizgame.img;
var quizDesc = parsed.quizgame.description;
var quizWelcome = parsed.quizgame.welcome;
var quizGoodbye = parsed.quizgame.goodbye;

var ikeaproducts = parsed.quizgame.levels[0].questions;

console.log(ikeaproducts[0].name);

var productindex;
var score=0, round=0, totalScore=0, gamelevel=0;
var startTime, endTime;
const constNbrAnswers = 3; //Must be lower then the number of products

// Score variables - each question can give you between 500-1000 points depending on how fast you answer
const constScoreMinPoints = 500;
const constScoreMaxPoints = 1000;                
const constScoreMinTime = 2000; // milliseconds
const constScoreMaxTime = 10000; // millseconds


function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var connector = useEmulator ? 
    new builder.ChatConnector({
        appId: process.env.MICROSOFT_APP_ID,
        appPassword: process.env.MICROSOFT_APP_PASSWORD
    }) : 
    new botbuilder_azure.BotServiceConnector({
        appId: process.env['MicrosoftAppId'],
        appPassword: process.env['MicrosoftAppPassword'],
        stateEndpoint: process.env['BotStateEndpoint'],
        openIdMetadata: process.env['BotOpenIdMetadata']
    });

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('Bot started successfully with endpoint at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());
} else {
    module.exports = { default: connector.listen() }
}

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [

    function (session) {
        session.userData.test = "jonas";
        session.send(session.userData.test)     
    }

]);
/*
        // Send a greeting and show help.
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title(quizTitle)
                    .subtitle(quizSubtitle)
                    .text(quizDesc)
                    .images([
                        builder.CardImage.create(session, quizImgURL)
                    ])
                    //.tap(builder.CardAction.openUrl(session, "http://www.ikea.com/"))
            ]);
        session.send(msg);

        session.send(quizWelcome);

        // How to get Skype/FB user
        var address = JSON.stringify(session.message.source);
        var address2 = JSON.parse(address);
        //session.send("MSG: %s", address2["channelId"]);
        //session.send("MSG: %s", JSON.parse(address));
                
        session.beginDialog('/menu');

    },
    function (session, results) {
        // Always say goodbye
        session.send(quizGoodbye);
    }

]);

// Add root menu dialog
bot.dialog('/menu', [
    function (session) {
        session.send(session.userData.test);
        builder.Prompts.choice(session, "What do you want to do? (wave) 🖤 :-)", "Play game|Rules|See hiscore|Quit", { listStyle: builder.ListStyle.list });
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                round = 0;
                session.beginDialog('/Play game');
                break;
            case 1:
                session.beginDialog('/Rules');
                break;
            case 2:
                session.beginDialog('/ListHiscore');
                break;
            default:
                session.endDialog();
                break;
        }
    },
    function (session) {
        // Reload menu
        session.replaceDialog('/menu');
    }
]).reloadAction('showMenu', null, { matches: /^(menu|back)/i });

// List hiscore
bot.dialog('/Listhiscore', [
    function (session) {
       session.send("This will list the hiscore");
       session.endDialog();
    }
])


// Rules
bot.dialog('/Rules', [
    function (session) {
       session.send(quizRules);
       session.endDialog();
    }
])


// Play game
bot.dialog('/Play game', [
    
    function (session) {
        
        session.sendTyping();

        gamelevel = 0;
        session.beginDialog('/Playing', gamelevel)
       
    }
])


// Play game
bot.dialog('/Playing', [
    
    function (session, gamelvl) {
        
        console.log(parsed.quizgame.levels[gamelvl].levelname)

        ikeaproducts = parsed.quizgame.levels[gamelvl].questions;

        var s = shuffleArray(ikeaproducts);
        var nbrAnswers = constNbrAnswers % s.length;

        round=round+1;
        if (round>3) nbrAnswers = (nbrAnswers+1) % s.length;

        if (round>1) {
            gamelvl=1;
        }

        productindex = Math.floor(Math.random() * nbrAnswers);

        var card = new builder.HeroCard(session)
            .title("Round " + round + " - What IKEA product is this?")
            //.text("What IKEA product is this?")
            .images([
                 builder.CardImage.create(session, s[productindex].image)
            ]);
        var msg = new builder.Message(session).attachments([card]);

        session.send(msg);

        var answers=[];
        for(var i=0;i<nbrAnswers;i++) {
           answers[i]=s[i].name;
        }

        startTime = new Date().getTime();
        //builder.Prompts.choice(session, "Round: " + round + " - What IKEA product is this?", answers, { listStyle: builder.ListStyle.button });        
        builder.Prompts.choice(session, ["Pick an answer", "Pick"], answers, { listStyle: builder.ListStyle.button });        
    },
    function (session, results) {
         if (results.response && results.response.entity != 'quit') {
                        
            session.send("You chose '%s'", results.response.entity);                        

            if (results.response.entity==ikeaproducts[productindex].name){
                endTime = new Date().getTime();
                
                // Calculate score
                score = constScoreMinPoints + Math.floor(((constScoreMaxPoints-constScoreMinPoints) * (1 - ((Math.max(Math.min(endTime-startTime,constScoreMaxTime),constScoreMinTime))-constScoreMinTime) / (constScoreMaxTime-constScoreMinTime))));
                console.log(score);

                totalScore=totalScore+score;
                session.send("Your answer is correct.\n Your total score is now: %s.", totalScore);
                session.replaceDialog('/Playing', 1);
            } else {
                session.send("Your answer is wrong.\n The name of the product is '"+ikeaproducts[productindex].name+"'. Your score was: "+totalScore);
                totalScore=0;
                session.endDialog();
            }

        } else {
            // Exit the game
            session.endDialog();
        }
    }
])


*/