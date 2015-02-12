FORMAT: 1A

# jquery-rest-store
Testing api for the implementation of a JSON REST store in jQuery (https://github.com/joshuaboshi/jquery-store)

## Notes Collection [/notes]
### List all Notes [GET]
+ Response 200 (application/json)

        [{
          "id": 1, "title": "Jogging in park"
        }, {
          "id": 2, "title": "Pick-up posters from post-office"
        }]

### Create a Note [POST]
+ Request (application/json)

        { "title": "Buy cheese and bread for breakfast." }

+ Response 201 (application/json)

        { "id": 3, "title": "Buy cheese and bread for breakfast." }

## Note [/notes/{id}]
A single Note object with all its details

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the Note to perform action with. Has example value.

### Update a Note [PUT]
+ Request (application/json)

        { "id": 3, "title": "Buy cheese and bread for dinner." }

+ Response 200 (application/json)

        { "id": 3, "title": "Buy cheese and bread for dinner." }

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the Note to perform action with. Has example value.

### Retrieve a Note [GET]
+ Response 200 (application/json)

    + Header

            X-My-Header: The Value

    + Body

            { "id": 2, "title": "Pick-up posters from post-office" }

### Remove a Note [DELETE]
+ Response 204
