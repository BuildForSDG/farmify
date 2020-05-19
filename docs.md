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
userType : `0:for buyers || 1: for farmers || 2: for services`  

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
------------------------------------------------------------------------------------------
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
------------------------------------------------------------------------------------------
## products/all

### Accepted Methods

`GET`

### Headers

`Content-Type` : `application/json`

### Optional Query Params
 
filter   : `comma separated string`  
page : `number`  

### Response on success

`statusCode`: `200`  

Response body  
`Content-Type`: `application/json`  
`body: {   
    \tdata: {  
        t\tname: `string`,  
        \t\tcategory: `string`,  
        \t\tfarmer_id: `integer`,  
        \t\tavailable: `boolean`,  
        \t\tavailability: `date or null`,  
        \t\tstock: `number`,  
        \t\tprice: `number`,  
        \t\timg_url: `URL`  
    \t},  
    \tnextPage: `URL address`,  
    \tprevPage: `URL address`  
}`,

### Response on failure

`statusCode`: `400 || 500`  
`Content-Type`: `application/json`  
 Response body  
 body:{  
     \terror:`string`  
 }
------------------------------------------------------------------------------------------
## products/all

### Accepted Methods

`GET`

### Headers

`Content-Type` : `multipart/form-data`  
Request must be sent with `httpOnly` cookies gotten from login  
User sending request to this route must be a farmer  
### Required body Params

name: `string`,  
category: `string`,  
farmer_id: `integer`,  
available: `boolean`,  
availability: `date or null`,  
stock: `number`,  
price: `number`,  
productImage:`FILE`  

### Response on success

`statusCode`: `204`

### Response on failure

`statusCode`: `400 || 500`  
`Content-Type`: `application/json`  
 Response body  
 body:{  
     \terror:`array | string`  
 }


