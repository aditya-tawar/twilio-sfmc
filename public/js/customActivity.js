define([
    'postmonger'
], function(
    Postmonger
) {
    'use strict';
    console.log("in the custom activity ");
    var connection = new Postmonger.Session();
    var payload = {};
    var lastStepEnabled = false;
    var steps = [ // initialize to the same value as what's set in config.json for consistency
        { "label": "Create SMS Message", "key": "step1" }
    ];
    var currentStep = steps[0].key;

    $(window).ready(onRender);

    console.log("Before initializing");
    connection.on('initActivity', initialize);
    console.log("After initializing");
    connection.on('requestedTokens', onGetTokens);
    console.log("After requested Tokens");
    connection.on('requestedEndpoints', onGetEndpoints);
    console.log("After Requested Endpoints");

    connection.on('clickedNext', save);
    console.log("After save is clicked");
    //connection.on('clickedBack', onClickedBack);
    //connection.on('gotoStep', onGotoStep);

    function onRender() {
        console.log("In onRender");
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');
        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        console.log("Out onRender");
    }

  function initialize(data) {
        console.log("Initializing data data: "+ JSON.stringify(data));
        if (data) {
            payload = data;
        }    

        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
         );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        console.log('Has In arguments: '+JSON.stringify(inArguments));

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {

                if (key === 'accountSid') {
                    $('#accountSID').val(val);
                }

                if (key === 'authToken') {
                    $('#authToken').val(val);
                }

                // if (key === 'messagingService') {
                //     $('#messagingService').val(val);
                // }

                if (key === 'body') {
                    $('#messageBody').val(val);
                }                                                               

            })
        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });

    }

    function onGetTokens (tokens) {
        // Response: tokens = { token: <legacy token>, fuel2token: <fuel api token> }
        console.log("Tokens function: "+JSON.stringify(tokens));
        //authTokens = tokens;
    }

    function onGetEndpoints (endpoints) {
         //Response: endpoints = { restHost: <url> } i.e. "rest.s1.qa1.exacttarget.com"
        console.log("Get End Points function: "+JSON.stringify(endpoints));
    }

    function save() {
        console.log("In save function");
        var accountSid = $('#accountSid').val();
        var authToken = $('#authToken').val();
    //    var messagingService = $('#messagingService').val();
        var body = $('#messageBody').val();
       // console.log("in the save option "+ body);
       console.log("Before Payload setting");
        payload['arguments'].execute.inArguments = [{
            "accountSid": accountSid,
            "authToken": authToken,
    //        "messagingService": messagingService,
            "body": body,
            "to": "{{Contact.Attribute.telegramActivity.chatid}}" ,//<----This should map to your data extension name and phone number column
           
        }];       
        console.log("After Payload setting");
        payload['metaData'].isConfigured = true;
        console.log("Payload on SAVE function: "+JSON.stringify(payload));
        connection.trigger('updateActivity', payload);
        console.log("After update activity trigger");

    }                    

});