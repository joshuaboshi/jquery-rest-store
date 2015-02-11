# jquery-rest-store #
Implementation of a JSON REST store in jQuery conforming with dojo/store api.

Parts of the source code were copied and adopted directly from the Dojo project (https://github.com/dojo/dojo).

Namely these sources: 

 * <https://github.com/dojo/dojo/blob/master/store/JsonRest.js>
 * <https://github.com/dojo/dojo/blob/master/store/util/QueryResults.js>
 * <https://github.com/dojo/dojo/blob/master/_base/lang.js>

Only basic functionality was tested (check test.html). More complex tests are planned.

Feel free to report any bugs to the issue tracker.

## Dependencies ##
 * jQuery => 1.11.0
 * JSON.toString (use shim, if you need to support old browsers)

## Usage ##

You can find the in depth descrition of the store's API in [dojo documentation](http://dojotoolkit.org/reference-guide/1.10/dojo/store.html).

Include the script to you app and initialize the store:
```javascript
    var testStore = new $.RestStore({
        target: 'http://your-service/api/rest-collection'
    });
```

### Query for items ###

```javascript
    testStore.query(q).then(function (result) {
        console.log(result);
    }, function (err) {
        console.error(err);
    });
```

The `q` variable is the query parameters. It can either be empty, or a query string (`a=1&b=2`), or an object (`{a:1,b:2}`).


## Notes ##
 * jQuery's implementation of promises - jQuery.Deferred() is used

## Limitations ##

 * Only JSON format is supported and expected by the store



## Apiary testing server ##

The `test.htm` is performing against the Apiary service described here <http://docs.jqueryreststore.apiary.io/#reference>

