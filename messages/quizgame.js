
module.exports = {

    quizgame: function() {

    return({ "quizgame": {
        "title" : "IKEA botquiz - the new version",
        "subtitle": "Do you know your IKEA furniture?",
        "description": "This is a simple game where you get to test your knowledge about the name of different IKEA furniture.",
        "img": "https://www.ikea.com/ms/img/header/logo.gif",
        "rules": "The rules of the game are really simple!",
        "welcome": "Hi... I'm the IKEA gaming robot!  (wave)",
        "goodbye": "Ok... Welcome back! Just type hello to wake me up again...",
        "levels": 
        [ 
            {
            "levelname": "Level 1 - Easy level",
            "nbrofquestions" : 5,
            "questions": 
            [
            // Mixed
            { "name": "BREIM", "image": "https://www.ikea.com/PIAimages/0291703_PE424963_S3.JPG"}, 
            { "name": "SKUBB", "image": "https://www.ikea.com/PIAimages/0277256_PE416198_S3.JPG"},
            { "name": "KUPOL", "image": "https://www.ikea.com/cn/en/images/products/kupol-castor-grey__0133605_PE289154_S4.JPG"},
            { "name": "BOKSEL", "image": "https://www.ikea.com/PIAimages/0119835_PE276267_S3.JPG"}, 
            { "name": "STOCKHOLM", "image": "https://www.ikea.com/cn/en/images/products/stockholm-bedside-table-yellow__0177064_PE329944_S4.JPG"},
            { "name": "FJÄLLA", "image": "https://www.ikea.com/PIAimages/0321583_PE515950_S3.JPG"}, 

            // Tables
            { "name": "LISABO", "image": "https://www.ikea.com/PIAimages/0325067_PE523174_S3.JPG"}, 
            { "name": "VEJMON", "image": "https://www.ikea.com/PIAimages/0307444_PE427864_S3.JPG"}, 
            { "name": "ARKELSTORP", "image": "https://www.ikea.com/PIAimages/0260729_PE404586_S3.JPG"}, 
            { "name": "MÖRBYLÅNGA", "image": "https://www.ikea.com/PIAimages/0364486_PE548340_S3.JPG"},
           
            // Chairs
            { "name": "GAMLEBY", "image": "http://www.ikea.com/PIAimages/0292758_PE425389_S3.JPG"},
            { "name": "HENRIKSDAL", "image": "http://www.ikea.com/PIAimages/0462846_PE608351_S3.JPG"},
            { "name": "BÖRJE", "image": "http://www.ikea.com/PIAimages/0449259_PE598768_S3.JPG"},
            { "name": "JANINGE", "image": "http://www.ikea.com/PIAimages/0325073_PE517376_S3.JPG"},
            { "name": "NISSE", "image": "http://www.ikea.com/PIAimages/74032_PE190779_S3.JPG"},
            { "name": "TERJE", "image": "http://www.ikea.com/PIAimages/0140865_PE300863_S3.JPG"},
            { "name": "VILMAR", "image": "http://www.ikea.com/PIAimages/0214682_PE370791_S3.JPG"},
            { "name": "LEIFARNE", "image": "http://www.ikea.com/PIAimages/0376676_PE553889_S3.JPG"},
            { "name": "NORRÅKER", "image": "http://www.ikea.com/PIAimages/0440364_PE592358_S3.JPG"},
            { "name": "NORRARYD", "image": "http://www.ikea.com/PIAimages/0418689_PE575725_S3.JPG"},

            // Sofas
            { "name": "KLIPPAN", "image": "http://www.ikea.com/PIAimages/0239989_PE379592_S3.JPG"},
            { "name": "NORSBORG", "image": "http://www.ikea.com/PIAimages/0398539_PE564975_S3.JPG"},

            ]
            },
            {
            "levelname": "Level 2 - Medium level",
            "nbrofquestions" : 2,
            "questions": 
            [
                { "name": "STOCKHOLM", "image": "http://www.ikea.com/cn/en/images/products/stockholm-bedside-table-yellow__0177064_PE329944_S4.JPG"},
                { "name": "FJÄLLA", "image": "http://www.ikea.com/PIAimages/0321583_PE515950_S3.JPG"}, 
                { "name": "FJÄLLA", "image": "http://www.ikea.com/PIAimages/0321583_PE515950_S3.JPG"}, 
                { "name": "MÖRBYLÅNGA", "image": "http://www.ikea.com/PIAimages/0364486_PE548340_S3.JPG"}
            ]
            }
        ]
    }})

}}

