(function( $ ) {

    $.fn.easyajax = function( options ) {

        //Default Settings
        var settings = $.extend( true, {}, {

            navigation: {
                active: true,
                options: {
                    selector: 'a[href]:not(.no-ajax):not([href^="#"])',
                    appendTo: 'main',
                    urlUpdate: true,
                    titleUpdate: true,
                    method: 'GET',
                    data: {}
                }
            },
            forms: {
                active: true,
                options: {
                    selector: 'form[action]:not(.no-ajax):not([action^="#"])',
                    data: {},
                    backendConfirmationKey: 'status'
                },
                onValidate: function( response ) {}
            }

        }, options );

        //If navigation module is active
        if( settings.navigation.active ) {

            //On click based in settings.selector
            $( this ).on( 'click', settings.navigation.options.selector, function( event ) {

                //Prevent default click action
                event.preventDefault();

                let element = $( this ),
                    href = element.attr( 'href' );

                constructPage( href, settings );

            });

            //Browser return action
            $( window ).on( 'popstate', function( event ) {

                //Prevent default return action
                event.preventDefault();

                //Get URL
                let url = location.href;

                constructPage( url, settings );

            });

        }

        //If forms module is active
        if( settings.forms.active ) {

            $( this ).on( 'submit', settings.forms.options.selector, function( event ){

                //Prevent default submit action
                event.preventDefault();

                let confirmation = true,
                    form = $( this ),
                    action = form.attr( 'action' ),
                    method = form.attr( 'method' ),
                    redirect = form.data( 'redirect' ),
                    submit = form.find( 'input[type="submit"], button[type="submit"], a.submit' );

                //Verify if some element with 'required' attribute is empty or invalid
                form.find( '*[required]' ).each( function () {

                    //If element is empty or have 'invalid' class
                    if( $( this ).val() === "" || $( this ).hasClass( 'invalid' ) ) {

                        confirmation = false;

                    }

                });

                //If form is valid
                if( confirmation ) {

                    let data = $.extend({}, objectifyForm(form.serializeArray()), settings.forms.options.data );

                    //Disable submit button
                    submit.prop( 'disabled', 'disabled' ).addClass( 'disabled' );

                    $.ajax({
                        url: action,
                        method: method,
                        data: data,
                        dataType: 'JSON',
                        complete: function() {

                            //Enable submit button
                            submit.prop( 'disabled', false ).removeClass( 'disabled' );

                        },
                        success: function( response ) {

                            //Call 'onValidate' function
                            settings.forms.onValidate.call( '', response );

                            //If response confirmation key is TRUE
                            if( response[settings.forms.options.backendConfirmationKey] ) {

                                //If data-redirect param is not empty
                                if( redirect !== "" ) {

                                    //If navigation module is active
                                    if( settings.navigation.active ) {

                                        constructPage( redirect, settings );

                                    } else {

                                        window.location.replace( redirect );

                                    }

                                }

                            }

                        },
                        error: function( jqXHR, str ) {

                            //Call 'onValidate' function
                            settings.forms.onValidate.call( '', {[settings.forms.options.backendConfirmationKey]: false, error: str} );

                        }
                    });

                } else {

                    //Call 'onValidate' function
                    settings.forms.onValidate.call( '', {[settings.forms.options.backendConfirmationKey]: false, error: 'Some required field is blank or invalid!'} );

                }

            });

        }
    };

    //Construct Page based on URL and SETTINGS
    function constructPage( url, settings ) {

        $.ajax({
            async: true,
            url: url,
            dataType: 'HTML',
            method: settings.navigation.options.method,
            data: settings.navigation.options.method,
            beforeSend: function() {

                $( 'body' ).addClass( 'loading' );

            },
            success: function( data ) {

                $( 'body' ).removeClass( 'loading' );

                let body = data.substring( data.indexOf("<body>"), data.indexOf("</body>") + 7 ),
                    title = $( data ).filter('title').text(),
                    scripts = getScripts( data, url );

                //Load asynchronous scripts in page
                let deferred = new $.Deferred(),
                    promise = deferred.promise();

                for ( let i in scripts ) {

                    (function () {

                        promise = promise.then( function() {

                            return loadScript( scripts[i] );

                        });

                    }());

                }

                deferred.resolve();

                //Construct page
                $( settings.navigation.options.appendTo ).html( body );

                //Update URL
                if( settings.navigation.options.urlUpdate ) history.pushState( body, title, url );

                //Update Title
                if( settings.navigation.options.titleUpdate ) $( document ).attr( 'title', title );

            }
        });

    }

    //Get <scripts> source URL
    function getScripts( data, currentUrl ) {

        let initialIndexes = getAllIndexes( data, "<script" ),
            finalIndexes = getAllIndexes( data, "</script>" ),
            scripts = [];

        for ( let i = 0; i < initialIndexes.length; i++ ) {

            let script = data.substring( initialIndexes[i], finalIndexes[i] + 9 );

            //Ignore in-archive scripts
            if(!script.includes("<script>")) {

                let pattern = /^https?:\/\//i,
                    baseUrl = window.location.origin + window.location.pathname,
                    url = script.split("src=")[1];
                    url = ((url !== undefined)?url.split( url.substring(0, 1) )[1]:"");

                //Check if is RELATIVE url
                if( !pattern.test( url ) ) {

                    //Relative URL
                    url = new URL(url, baseUrl+currentUrl).href;

                }

                scripts.push( url );

            }

        }

        return scripts;

    }

    function loadScript(URL) {

        return $.getScript(URL).done(function(){});

    }

    function getAllIndexes(arr, val) {

        var indexes = [], i = -1;

        while ((i = arr.indexOf(val, i+1)) !== -1){

            indexes.push(i);

        }

        return indexes;
    }

    function objectifyForm(formArray) {

        var returnArray = {};
        for (var i = 0; i < formArray.length; i++){
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
        return returnArray;
    }

}( jQuery ));