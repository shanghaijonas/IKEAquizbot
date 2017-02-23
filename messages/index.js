// This is my first coding

"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var jsonfile = require('jsonfile');

var file = '../hiscore.json';
var fileQuiz = '../quiz.json';
var obj;

//jsonfile.readFile(fileQuiz, function(err, obj) {
  //console.dir(obj)
//})

var kanske = jsonfile.readFileSync(fileQuiz);

//console.log(kanske);

//var obj = {name: 'Jonas', score :'800'}
 
//jsonfile.writeFileSync(file, obj, {spaces: 2})



//jsonfile.writeFile(file, obj, function (err) {
//  console.error(err)
//})

//console.log('File: %s', JSON.stringify(obj.name));




var useEmulator = (process.env.NODE_ENV == 'development');

useEmulator=true;
console.log('Environment: %s', process.env.NODE_ENV);
console.log('Start with emulator: %s', useEmulator);

var quizgame = { "quizgame": {
    "title" : "IKEA botquiz",
    "subtitle": "Subtitles",
    "rules": "This is the rules",
    "levels": 
      [ 
        {
        "levelname": "Easy level",
        "nbrofquestions" : 5,
        "questions": 
          [
            { "q1" : "k" , "image" : "url"},
            { "q1" : "k" , "image" : "url"},
            { "q1" : "k" , "image" : "url"},
            { "q1" : "k" , "image" : "url"},
            { "q1" : "k" , "image" : "url"}
          ]
        },
        {
        "levelname": "Level 2 - Medium level",
        "nbrofquestions" : 5,
        "questions": 
          [
            { "q1" : "k" , "image" : "url"},
            { "q1" : "k" , "image" : "url"},
            { "q1" : "k" , "image" : "url"},
            { "q1" : "k" , "image" : "url"},
            { "q1" : "k" , "image" : "url"}
          ]
        }
      ]
}};



var parsed = kanske; //quizgame; //JSON.parse(quizgame);
console.log('done');

//console.log('levels %s', parsed.quizgame.levels[0].levelname); 

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
var score=0, round=0, totalScore=0;
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

        // Setup game


        // How to get Skype/FB user
        var address = JSON.stringify(session.message.address);
        var address2 = JSON.parse(address);
        //session.send("MSG: %s", address2["channelId"]);
        session.send("MSG: %s", JSON.parse(address));
                
        session.beginDialog('/menu');

    },
    function (session, results) {
        // Always say goodbye
        session.send(quizgoodbye);
    }

]);

// Add root menu dialog
bot.dialog('/menu', [
    function (session) {
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

        var s = shuffleArray(ikeaproducts);
        var nbrAnswers = constNbrAnswers % s.length;

        round=round+1;
        if (round>3) nbrAnswers = (nbrAnswers+1) % s.length;

        productindex = Math.floor(Math.random() * nbrAnswers);

        var card = new builder.HeroCard(session)
            .title("Round " + round + " - What IKEA product is this?")
            //.text("What IKEA product is this?")
            .images([
                 builder.CardImage.create(session, s[productindex].image)
            ]);
        var msg = new builder.Message(session).attachments([card]);

       /* var msg = new builder.Message(session)
            //.title('Hello')
            //.subtitle('Subtitle')
            //.text('Text')
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: s[productindex].image
            }]);*/
        
        /*var msg = new builder.Message(session)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments(new builder.HeroCard(session)
                    .title('What IKEA furnitures is this?')
                    .subtitle('Subtitle')
                    .text('The text')
                    .images([
                        builder.CardImage.create(session, s[productindex].image)
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, 'https://azure.microsoft.com/en-us/services/storage/', 'Learn More')
                    ]));*/

        session.send(msg);

        var answers=[];
        for(var i=0;i<nbrAnswers;i++) {
           answers[i]=s[i].name;
        }

        startTime = new Date().getTime();
        //builder.Prompts.choice(session, "Round: " + round + " - What IKEA product is this?", answers, { listStyle: builder.ListStyle.button });        
        builder.Prompts.choice(session, "", answers, { listStyle: builder.ListStyle.button });        
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
                session.replaceDialog('/Play game');
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

