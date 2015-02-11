# jquery-rest-store #
Implementation of a JSON REST store in jQuery conforming with [dojo/store api](http://dojotoolkit.org/reference-guide/1.10/dojo/store.html).

Parts of the source code were copied and adopted directly from the Dojo project (<https://github.com/dojo/dojo>).

Namely these sources: 

 * <https://github.com/dojo/dojo/blob/master/store/JsonRest.js>
 * <https://github.com/dojo/dojo/blob/master/store/util/QueryResults.js>
 * <https://github.com/dojo/dojo/blob/master/_base/lang.js>

Only basic functionality was tested (check test.html). More complex tests are planned.

**Feel free to report any bugs to the issue tracker.**

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

This will trigger a GET request to `http://your-service/api/rest-collection` endpoint.

The `q` variable is the query parameters. It can either be empty, or a query string (`a=1&b=2`), or an object (`{a:1,b:2}`).


### Get a single item ###

```javascript
    testStore.get(2).then(function (result) {
        console.log(result);
    }, function (err) {
        console.error(err);
    });
```

This will trigger a GET request to `http://your-service/api/rest-collection/2` endpoint.

### Add a new item ###

```javascript
    var data = {
        title: "Buy cheese and bread for breakfast."
    };
    
    testStore.add(data).then(function (result) {
        console.log(result);
    }, function (err) {
        console.error(err);
    });
```

This will trigger a POST request to `http://your-service/api/rest-collection` endpoint. With `data` in request body, serialized as JSON.

### Update an existing item ###

```javascript
    var data = {
        id: "3",
        title: "Buy cheese and bread for dinner."
    };
    
    testStore.put(data).then(function (result) {
        console.log(result);
    }, function (err) {
        console.error(err);
    });
```

This will trigger a PUT request to `http://your-service/api/rest-collection/3` endpoint. With `data` in request body, serialized as JSON.

### Delete an existing item ###

```javascript
    testStore.remove(3).then(function (result) {
        console.log(result);
    }, function (err) {
        console.error(err);
    });
```

This will trigger a DELETE request to `http://your-service/api/rest-collection/3` endpoint. 

## Notes ##
 * jQuery's implementation of promises - jQuery.Deferred() is used
 * require.js loader supported

## Limitations ##

 * Only JSON format is supported and expected by the store

## Apiary testing server ##

The `test.htm` is performing against the [Apiary](http://apiary.io) service described here <http://docs.jqueryreststore.apiary.io/#reference>

