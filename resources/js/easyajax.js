(function( $ ) {

    $.fn.easyajax = function( options ) {

        //Default Settings
        var settings = $.extend({

            selector: 'a[href]:not(.no-ajax):not([href^="#"])',
            appendTo: 'main',
            urlUpdate: true,
            titleUpdate: true

        }, options );

        //On click based in settings.selector
        $( this ).on( 'click', settings.selector, function( event ) {

            //Prevent default click action
            event.preventDefault();

            let element = $( this ),
                href = element.attr( 'href' );

            $.ajax({
                async: true,
                url: href,
                dataType: 'HTML',
                beforeSend: function() {

                    element.addClass( 'loading' );

                },
                success: function( data ) {

                    element.removeClass( 'loading' );

                    let body = data.substring( data.indexOf("<body>") + 6, data.indexOf("</body>") ),
                        title = $( data ).filter('title').text();

                    //Construct page
                    $( settings.appendTo ).html( body );

                    //Update URL
                    if( settings.urlUpdate ) window.history.pushState( data, title, href );

                    //Update Title
                    if( settings.titleUpdate ) $( document ).attr( 'title', title );

                }
            });

        });

    };

}( jQuery ));