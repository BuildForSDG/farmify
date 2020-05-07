# API Documentation

## users/register

### Accepted Methods

`POST`
### Headers

`Content-Type` : `application/json` 

### Required fields

firstName: `string`
lastName : `string`
email    : `string`
phone    : `string, minLength: 11, maxLength: 11`
password : `string, minLength: 8, maxLength: 16`
city     : `string`
state    : `string`
address  : `string`
country  : `string`
userType : `0 || 1 || 2`

### Response on success

statusCode: `200`
JSON response
body: { user :{...}}

Users should be redirected to the login page after successful registration

### Response on failure

statusCode: `400`
Invalid or incomplete parameters

statusCode: `500`
Server Error

## users/login

### Accepted Methods

`POST`

### Headers

`Content-Type` : `application/json`

### Required Fields
 
email    : `string`
password : `string, minLength: 8, maxLength: 16`

### Response on success

`statusCode`: `200`
`httpOnlyCookie`

Response body
`Content-Type`: `application/json`
`body: { user: {...}}`,

### Response on failure

`statusCode`: `401`
`Invalid username or password`

`statusCode`: `400`
`Invalid or incomplete parameters`

`statusCode`: `500`
`Server Error`


