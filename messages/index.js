// This is my first coding

"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
//var restify = require('node_modules/restify');

var useEmulator = (process.env.NODE_ENV == 'development');

var ikeaproducts = [
    { name: "BREIM", image: "http://www.ikea.com/PIAimages/0291703_PE424963_S3.JPG"}, //http://www.ikea.com/cn/en/images/products/breim-wardrobe-blue__0291705_PE424964_S4.JPG
    { name: "SKUBB", image: "http://www.ikea.com/PIAimages/0277256_PE416198_S3.JPG"}, //http://www.ikea.com/cn/en/images/products/skubb-storage-case-white__0277256_PE416198_S4.JPG
    { name: "KUGGIS", image:"http://www.ikea.com/PIAimages/0372094_PE551690_S3.JPG"}, //http://www.ikea.com/cn/en/images/products/kuggis-box-with-lid-white__0372097_PE551689_S4.JPG
    { name: "KUPOL", image: "http://www.ikea.com/cn/en/images/products/kupol-castor-grey__0133605_PE289154_S4.JPG"},
    { name: "NORSBORG", image: "http://www.ikea.com/PIAimages/0398539_PE564975_S3.JPG"}, //http://www.ikea.com/cn/en/images/products/norsborg-chaise-longue-white__0377666_PE558908_S4.JPG
    { name: "LISABO", image: "http://www.ikea.com/PIAimages/0325067_PE523174_S3.JPG"}, //http://www.ikea.com/cn/en/images/products/lisabo-coffee-table__0326096_PE518132_S4.JPG
    { name: "VEJMON", image: "http://www.ikea.com/PIAimages/0307444_PE427864_S3.JPG"}, //http://www.ikea.com/cn/en/images/products/vejmon-coffee-table-brown__0089492_PE221833_S4.JPG
    { name: "ARKELSTORP", image: "http://www.ikea.com/PIAimages/0260729_PE404586_S3.JPG"}, //http://www.ikea.com/cn/en/images/products/arkelstorp-coffee-table-black__0260729_PE404586_S4.JPG
    { name: "BOKSEL", image: "http://www.ikea.com/PIAimages/0119835_PE276267_S3.JPG"}, //http://www.ikea.com/cn/en/images/products/boksel-coffee-table-white__0119835_PE276267_S4.JPG
    { name: "STOCKHOLM", image: "http://www.ikea.com/cn/en/images/products/stockholm-bedside-table-yellow__0177064_PE329944_S4.JPG"},
    { name: "FJÄLLA",image: "http://www.ikea.com/PIAimages/0321583_PE515950_S3.JPG"}, //http://www.ikea.com/cn/en/images/products/fjalla-box-with-lid-blue__0321554_PE515969_S4.JPG
    { name: "MÖRBYLÅNGA",image: "http://www.ikea.com/PIAimages/0364486_PE548340_S3.JPG"}
    
    
];

var productindex;
var score=0;
const constNbrAnswers = 3; //Must be lower then the number of products

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
     
    function (session) {
        // Send a greeting and show help.
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("IKEA quizbot")
                    .text("The <b>IKEA quizbot</b> is a demo to try out how a chatbot works")
                    .images([
                        builder.CardImage.create(session, "http://www.ikea.com/ms/img/header/logo.gif")
                    ])
                    .tap(builder.CardAction.openUrl(session, "http://www.ikea.com/"))
            ]);
        session.send(msg);

        var card = new builder.HeroCard(session)
            .title("IKEA guess the product :-)")
            .text("We give you the product image, you guess the name.")
            .images([
                 builder.CardImage.create(session, "http://www.ikea.com/ms/img/header/logo.gif")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I'm the IKEA gaming robot!");
        
        // How to get Skype/FB username
        session.send('Hello %s!', session.userData.name);

        session.beginDialog('/menu');
        
    },
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }

]);

// Add root menu dialog
bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What do you want to do? (wave)", "Play game|Rules|Quit", { listStyle: builder.ListStyle.inline });
    },
    function (session, results) {
        switch (results.response.index) {
            case 0:
                session.beginDialog('/Play game');
                break;
            case 1:
                session.beginDialog('/Rules');
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


// Rules
bot.dialog('/Rules', [
    function (session) {
       session.send("The rules of the game are really simple! (wave) (heart)");
       session.endDialog();
    }
])

// Play game
bot.dialog('/Play game', [
    function (session) {
        
        session.sendTyping();
        
        var s = shuffleArray(ikeaproducts);
        var nbrAnswers = constNbrAnswers % s.length;
        if (score>3) nbrAnswers = (nbrAnswers+1) % s.length;
        
        productindex = Math.floor(Math.random() * nbrAnswers);
                
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: s[productindex].image
            }]);
        session.send(msg);

        var answers=[];
        for(var i=0;i<nbrAnswers;i++) {
           answers[i]=s[i].name;
        }
        
       builder.Prompts.choice(session, "What IKEA product is this?", answers, { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
         if (results.response && results.response.entity != '(quit)') {
            session.send("You chose '%s'", results.response.entity);
            if (results.response.entity==ikeaproducts[productindex].name){
                score=score+1;
                session.send("Your answer is correct.\n Your score is now: "+score);
                session.replaceDialog('/Play game');
            } else {
                session.send("Your answer is wrong.\n The name of the product is '"+ikeaproducts[productindex].name+"'. Your score was: "+score);
                score=0;
                session.endDialog();
            }
         
        } else {
            // Exit the game
            session.endDialog();
        }
    }
])



if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
