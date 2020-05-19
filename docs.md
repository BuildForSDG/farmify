# API Documentation

## users/register

### Accepted Methods

`POST`
### Headers

`Content-Type` : `application/json` 

### Required fields

firstName: `string`\\s\\s
lastName : `string`\\s\\s
email    : `string`\\s\\s
phone    : `string, minLength: 11, maxLength: 11`\\s\\s
password : `string, minLength: 8, maxLength: 16`\\s\\s
city     : `string`\\s\\s
state    : `string`\\s\\s
address  : `string`\\s\\s
country  : `string`\\s\\s
userType : `0:for buyers || 1: for farmers || 2: for services`\\s\\s

### Response on success

statusCode: `200`\\s\\s
JSON response\\s\\s
body: { user :{...}}\\s\\s

Users should be redirected to the login page after successful registration\\s\\s

### Response on failure

statusCode: `400`\\s\\s
Invalid or incomplete parameters\\s\\s

statusCode: `500`\\s\\s
Server Error\\s\\s
------------------------------------------------------------------------------------------
## users/login

### Accepted Methods

`POST`

### Headers

`Content-Type` : `application/json`

### Required Fields
 
email    : `string`\\s\\s
password : `string, minLength: 8, maxLength: 16`\\s\\s

### Response on success

`statusCode`: `200`\\s\\s
`httpOnlyCookie`\\s\\s

Response body\\s\\s
`Content-Type`: `application/json`\\s\\s
`body: { user: {...}}`,\\s\\s

### Response on failure

`statusCode`: `401`\\s\\s
`Invalid username or password`\\s\\s

`statusCode`: `400`\\s\\s
`Invalid or incomplete parameters`\\s\\s

`statusCode`: `500`\\s\\s
`Server Error`\\s\\s
------------------------------------------------------------------------------------------
## products/all

### Accepted Methods

`GET`

### Headers

`Content-Type` : `application/json`

### Optional Query Params
 
filter   : `comma separated string`\\s\\s
page : `number`\\s\\s

### Response on success

`statusCode`: `200`\\s\\s

Response body\\s\\s
`Content-Type`: `application/json`\\s\\s
`body: { \\s\\s
    \tdata: {\\s\\s
        t\tname: `string`,\\s\\s
        \t\tcategory: `string`,\\s\\s
        \t\tfarmer_id: `integer`,\\s\\s
        \t\tavailable: `boolean`,\\s\\s
        \t\tavailability: `date or null`,\\s\\s
        \t\tstock: `number`,\\s\\s
        \t\tprice: `number`,\\s\\s
        \t\timg_url: `URL`\\s\\s
    \t},\\s\\s
    \tnextPage: `URL address`,\\s\\s
    \tprevPage: `URL address`\\s\\s
}`,

### Response on failure

`statusCode`: `400 || 500`\\s\\s
`Content-Type`: `application/json`\\s\\s
 Response body\\s\\s
 body:{\\s\\s
     \terror:`string`\\s\\s
 }
------------------------------------------------------------------------------------------
## products/all

### Accepted Methods

`GET`

### Headers

`Content-Type` : `multipart/form-data`\\s\\s
Request must be sent with `httpOnly` cookies gotten from login\\s\\s
User sending request to this route must be a farmer\\s\\s
### Required body Params

name: `string`,\\s\\s
category: `string`,\\s\\s
farmer_id: `integer`,\\s\\s
available: `boolean`,\\s\\s
availability: `date or null`,\\s\\s
stock: `number`,\\s\\s
price: `number`,\\s\\s
productImage:`FILE`\\s\\s

### Response on success

`statusCode`: `204`

### Response on failure

`statusCode`: `400 || 500`\\s\\s
`Content-Type`: `application/json`\\s\\s
 Response body\\s\\s
 body:{\\s\\s
     \terror:`array | string`\\s\\s
 }


