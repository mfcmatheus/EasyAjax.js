# EasyAjax.js - A fully ajax website framework

![](https://img.shields.io/badge/jQuery-v3.3.1-brightgreen.svg)

> EasyAjax.js is a helper for companies / developers who want to build a 100% AJAX website with URL updating and form validation without page refresh. With just one function call, your website will have the full AJAX links without any other JavaScript instruction.

[TOCM]

## Installation

You can download the latest version of EasyAjax.js from the [GitHub Releases]() or use a [CDN]().
```html
<script src=""></script>
```
and init the plugin with following code:
```javascript
$(document).ready(function(){
  $(document).easyajax(); //The Easy AJAX magic.
});
```
With just 3 lines of code all `<a>` elements will automatically redirect via ajax and `<form>` elements will validate in the BackEnd without updating the page.

**Warning**: The plugin is in its first version and may have unexpected bugs.

## Active / Deactive modules

EasyAjax.js allows you to decide which modules you want to use or not. See below the possible options.

**Note**: Any `<a>` or `<form>` element (**by default**) can cause the plugin to ignore them through the `.no-ajax` class.

Example:
```javascript
$(document).easyajax({
  navigation: {
    active: true,
    options: options
  },
  forms: {
    active: true,
    options: options
  }
});
```

### Navigation module
Using the navigation module is actually very easy, it will by default already make all `<a>` redirect elements via ajax by inserting the **server response** into the `<main>` element. But you can also change some options according to your need to use.

Example:
```javascript
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
}
```

#### Options
| Name | Type | Default | Description |
| ------------ | ------------ | ------------ | ------------ |
| `selector` | String | 'a[href]:not(.no-ajax):not([href^="#"])' | The selector that indicates the element to be clicked to redirect through the href attribute. |
| `appendTo` | String | 'main' | Indicates which element will construct the **HTML** returned by the server. |
| `urlUpdate` | Bool | True | Indicates whether the **URL** of the browser will change when redirecting to another page. |
| `titleUpdate` | Bool | True | Indicates whether the browser **tab title** will change when redirecting to another page. |
| `method` | String | 'GET' | Define the ajax send method. |
| `data` | Object | {} | Data object to send to server. |

------------

### Forms Module
The forms module causes user-entered data to be automatically sent to the BackEnd via POST (by **default**). You can also indicate to automatically redirect to a page through the `data-redirect` attribute** only when it passes the validation**, or you can manually control what to do after server validation.

Example:
```html
<form action="example.php" method="POST" data-redirect="anotherexample.php">
  ...
</form>
```
```javascript
forms: {
  active: true,
  options: {
    selector: 'form[action]:not(.no-ajax):not([action^="#"])',
    data: {},
    backendConfirmationKey: 'status'
    }
}
```
    <?php
    //example.php
    //Form module backend return example
    
    //Create your validation here
    
    echo json_encode( array( status => true ) ); // <-- The array KEY is configured in 'backendConfirmationKey'
	?>

#### Options
| Name | Type | Default | Description |
| ------------ | ------------ | ------------ | ------------ |
| `selector` | String | 'form[action]:not(.no-ajax):not([action^="#"])' | The selector that indicates the element. |
| `data` | Object | {} | Data object to **merge** with form values and send to server. |
| `backendConfirmationKey` | String | 'status' | The **JSON object key** containing True / False returned by the **server** indicating whether the values were validated or not. |

#### Manually Control after validation
The `data-redirect` attribute is an **optional** attribute, and you can manually control the action after validation.

Example:
```javascript
$(document).easyajax({
  forms: {
    onValidate: function( response ) {
      //Do something here ...
    }
  }
});
```
This function will be called after getting a response from the server, which may contain True / False status.

| Param | Type | Description |
| ------------ | ------------ | ------------ |
| `response` | Object | This parameter returns the value obtained by the server, so you can perform other actions directly in the FrontEnd. |

## Contributing
In case of bug fixes, feel free to report them by creating a pull request. For support, post questions on Stack Overflow with the `easyajax` tag.

Would you like a donation or business contact? [Get in touch](mailto:financeiro@theowly.com).

## License
EasyAjax.js is available under the [MIT license.](https://opensource.org/licenses/MIT)
