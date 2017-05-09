// This is my first coding

"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var quiz = require('./quizgame');

//var jsonfile = require('jsonfile');


var hiscore = [
    { "username" : "Player 1", "score" : 0},
    { "username" : "Player 2", "score" : 0},
    { "username" : "Player 3", "score" : 0},
    { "username" : "Player 4", "score" : 0},
    { "username" : "Player 5", "score" : 0},    
    { "username" : "Player 6", "score" : 0},   
    { "username" : "Player 7", "score" : 0},  
    { "username" : "Player 8", "score" : 0}, 
    { "username" : "Player 9", "score" : 0},    
    { "username" : "Player 10", "score" : 0}    
  ];


var file = '../hiscore.json';
var fileQuiz = '../quiz.json';
var obj;

var environment = process.env.NODE_ENV || 'development';
var useEmulator = (environment == 'development');
useEmulator = true;

console.log('Environment: %s', process.env.NODE_ENV);
console.log('Start with emulator: %s', useEmulator);

var quizgame = quiz.quizgame();
var quizTitle = quizgame.quizgame.title;
var quizSubtitle = quizgame.quizgame.subtitle;
var quizRules = quizgame.quizgame.rules;
var quizImgURL = quizgame.quizgame.img;
var quizDesc = quizgame.quizgame.description;
var quizWelcome = quizgame.quizgame.welcome;
var quizGoodbye = quizgame.quizgame.goodbye;

var ikeaproducts = quizgame.quizgame.levels[0].questions;


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
     
        // Send a greeting message.
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
        session.send("Hi %s", session.message.user.name);
                
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
        builder.Prompts.choice(session, "What do you want to do? (wave) 🖤 :-)", "Play game|Rules|See hiscore|Set username|Quit", { listStyle: builder.ListStyle.list });
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
            case 3:
                session.beginDialog('/SetUsername');
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
bot.dialog('/ListHiscore', [
    function (session) {       
       var msg ='This is the current hiscore:\n\n';

        hiscore.sort(function(a,b) {
            return b.score - a.score });

       for(var i=0; i<Math.min(hiscore.length, 10); i++) {
           
            msg = msg + (i+1) + '. ' + hiscore[i].username + '\t\t' + hiscore[i].score + '\n';
       }

       session.send(msg);
       session.endDialog();
    }
]);


// Rules
bot.dialog('/Rules', [
    function (session) {
       session.send(quizRules);
       session.endDialog();
    }
]);

bot.dialog('/SetUsername', [
    function (session) {
        builder.Prompts.text(session, 'What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.send('Your username is now set to "%s"', session.userData.name)
        session.endDialog();
    }
]);


// Play game
bot.dialog('/Play game', [
    
    function (session) {
        
        session.sendTyping();

        gamelevel = 0;
        //session.beginDialog('/Playing', gamelevel);        
        session.beginDialog('/Playing', JSON.stringify({ round: 0, level: 0 }));        
    }
    //,
    //function (session, results) {
        
      //  session.send('Score: %s', results.round);
    //}
]);


// Play game
bot.dialog('/Playing', [
    
    function (session, gamelvl) {
        
        var g = JSON.parse(gamelvl);

        gamelvl=g.level;

        console.log(quizgame.quizgame.levels[g.level].levelname)

        var nbrofQuestions = Math.min(quizgame.quizgame.levels[gamelvl].nbrofquestions, quizgame.quizgame.levels[gamelvl].questions.length);

        ikeaproducts = quizgame.quizgame.levels[gamelvl].questions;

        var s = shuffleArray(ikeaproducts);
        var nbrAnswers = constNbrAnswers % s.length;

        g.round=g.round+1;
        //if (g.round>3) nbrAnswers = (nbrAnswers+1) % s.length;

        //if (g.round>nbrofQuestions) {
            //gamelvl=1;
        //}

        productindex = Math.floor(Math.random() * nbrAnswers);

        var card = new builder.HeroCard(session)
            .title('Level ' + (g.level+1) + '/Round ' + g.round + ' - What IKEA product is this?')
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

        session.dialogData.g = g;

        //builder.Prompts.choice(session, "Round: " + round + " - What IKEA product is this?", answers, { listStyle: builder.ListStyle.button });        
        builder.Prompts.choice(session, ["Pick an answer!", "Choose an answer!", "Take your pick!"], answers, { listStyle: builder.ListStyle.button });        
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
                session.send("Your answer is correct. You got %s points. Your total score is now %s.", score, totalScore);

                console.log(quizgame.quizgame.levels[session.dialogData.g.level].nbrofquestions);

                // Create one round
                //if (session.dialogData.g.round == quizgame.quizgame.levels[session.dialogData.g.level].nbrofquestions) {
                  //  session.dialogData.g.level = Math.min (session.dialogData.g.level+1,quizgame.quizgame.levels.length-1);                    
//                    session.dialogData.g.round = 0;
  //              }

                session.replaceDialog('/Playing', JSON.stringify(session.dialogData.g));
            } else {
                session.send("Your answer is wrong.\n The name of the product is '"+ikeaproducts[productindex].name+"'. Your score was: "+totalScore);
                
                // Save hiscore - should use username id and save into DB or disk
                var username = session.userData.name ? session.userData.name : session.message.user.name
                hiscore.push({ "username" : username , "score" : totalScore});
                totalScore=0;
                
                session.endDialogWithResult(session.dialogData.g);
            }
        
        } else {
            // Exit the game
            session.endDialog();
        }
    }
]);


