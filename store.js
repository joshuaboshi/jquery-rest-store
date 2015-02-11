/*
* jquery-store v1.0.0
* Tomas Kralik (joshuaboshi@gmail.com)
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

// Universal module loader used from (https://github.com/umdjs/umd/blob/master/jqueryPlugin.js)
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	/*
		Large portions copied and adopted directly from DOJO REST store
		https://github.com/dojo/dojo/blob/master/store/JsonRest.js 
		and Dojo Query results
		https://github.com/dojo/dojo/blob/master/store/util/QueryResults.js
		and dojo/_base/lang
		https://github.com/dojo/dojo/blob/master/_base/lang.js
	*/

	var isUndefined = function (v) {
		return typeof v === "undefined";
	};
	
	var delegate = (function (){
		// boodman/crockford delegation w/ cornford optimization
		function TMP () {};
		return function (obj, props){
			TMP.prototype = obj;
			var tmp = new TMP();
			TMP.prototype = null;
			if (props) {
				$.extend(tmp, props);
			}
			return tmp; // Object
		};
	})();


	var QueryResults = function (results){
		if (!results) {
			return results;
		}

		var isPromise = !!results.then;

		// if it is a promise it may be frozen
		if (isPromise) {
			results = delegate(results);
		}

		function addIterativeMethod(method){
			// Always add the iterative methods so a QueryResults is
			// returned whether the environment is ES3 or ES5
			results[method] = function () {
				var args = arguments;
				var result = $.when(results, function (results) {
					Array.prototype.unshift.call(args, results);
					return QueryResults(array[method].apply(array, args));
				});
			
				// forEach should only return the result of when()
				// when we're wrapping a promise
				if(method !== "forEach" || isPromise){
					return result;
				}
			};
		}

		addIterativeMethod("forEach");
		addIterativeMethod("filter");
		addIterativeMethod("map");

		if (results.total == null) {
			results.total = $.when(results, function (results) {
				return results.length;
			});
		}

		return results; // Object
	};

	var RestStore = function (options) {
		this.target = options.target;
		this.headers = options.headers || {};
		this.idProperty = options.idProperty || "id";
		this.ascendingPrefix = options.ascendingPrefix || "+";
		this.descendingPrefix = options.descendingPref || "-";
		this.accepts = options.accepts || "application/javascript, application/json";
	};

	RestStore.prototype = {
		GET: 'GET',
		PUT: 'PUT',
		POST: 'POST',
		DELETE: 'DELETE',
		DATA_TYPE: 'json'
	};


	RestStore.prototype.get = function (id, options) {
		options = $.extend(
			{
				type: this.GET,
				url: this._getTarget(id)
			},
			options || {}
		);
		return this._makeRequest(options);
	};

	RestStore.prototype.put = function (object, options) {
		options = options || {};
		var id = ("id" in options) ? options.id : this.getIdentity(object),
			hasId = !isUndefined(id);

		options = $.extend(
			{
				type: hasId && !options.incremental ? this.PUT : this.POST,
				url: this._getTarget(id),
				data: JSON.stringify(object),
				headers: $.extend({
					"Content-Type": "application/json",
					Accept: this.accepts,
					"If-Match": options.overwrite === true ? "*" : null,
					"If-None-Match": options.overwrite === false ? "*" : null
				}, this.headers, options.headers)
			},
			options
		);

		return this._makeRequest(options);
	};

	RestStore.prototype.add = function (object, options) {
		options = options || {};
		options.overwrite = false;
		return this.put(object, options);
	};

	RestStore.prototype.remove = function (id, options) {
		options = options || {};
		return this._makeRequest({
			type: this.DELETE,
			url: this._getTarget(id),
			headers: $.extend({}, this.headers, options.headers)
		});
	};

	RestStore.prototype.query = function (query, options) {
		options = options || {};

		var headers = $.extend({ Accept: this.accepts }, this.headers, options.headers),
			hasQuestionMark = this.target.indexOf("?") > -1;

		if (query && typeof query == "object") {
			query = $.param(query);
			query = query ? (hasQuestionMark ? "&" : "?") + query : "";
		}

		if (options.start >= 0 || options.count >= 0) {
			headers["X-Range"] = "items=" + (options.start || '0') + '-' +
				(("count" in options && options.count != Infinity) ?
				(options.count + (options.start || 0) - 1) : '');

			if (this.rangeParam) {
				query += (query || hasQuestionMark ? "&" : "?") + this.rangeParam + "=" + headers["X-Range"];
				hasQuestionMark = true;
			} else {
				headers.Range = headers["X-Range"];
			}
		}

		if (options && options.sort) {
			var sortParam = this.sortParam;
			query += (query || hasQuestionMark ? "&" : "?") + (sortParam ? sortParam + '=' : "sort(");

			for (var i = 0; i < options.sort.length; i++) {
				var sort = options.sort[i];
				query += (i > 0 ? "," : "") + (sort.descending ? this.descendingPrefix : this.ascendingPrefix) + encodeURIComponent(sort.attribute);
			}

			if (!sortParam) {
				query += ")";
			}
		}

		var results = this._makeRequest({
			type: this.GET,
			url: this.target + (query || ""),
			headers: headers
		});

		results.total = results.then(function (data, status, request) {
			var range = request.getResponseHeader("Content-Range");
			if (!range) {
				// At least Chrome drops the Content-Range header from cached replies.
				range = request.getResponseHeader("X-Content-Range");
			}
			return range && (range = range.match(/\/(.*)/)) && +range[1];
		});

		return QueryResults(results);
	};

	RestStore.prototype.getIdentity = function (object) {
		// summary:
		//		Returns an object's identity
		// object: Object
		//		The object to get the identity from
		// returns: Number
		return object[this.idProperty];
	};



	RestStore.prototype._getTarget = function (id){
		// summary:
		//		If the target has no trailing '/', then append it.
		// id: Number
		//		The identity of the requested target
		var target = this.target;
		if (!isUndefined(id)) {
			if (target.charAt(target.length - 1) == '/') {
				target += id;
			} else {
				target += '/' + id;
			}
		}
		return target;
	};

	RestStore.prototype._makeRequest = function (options) {

		// prepare headers for the request
		var headers = $.extend(
				{},
				{ Accept: this.accepts },
				this.headers,
				options.headers || options
			);

		return $.ajax(
			options.url,
			{
				type: options.type,
				dataType: this.DATA_TYPE,
				headers: headers,
				data: options.data
			}
		);
	};

	if ($.RestStore) {
		throw 'RestStore already defined in jQuery.';
	}

	$.RestStore = RestStore;
	return RestStore;

}));