# Companies web service
This application is a web service which handels informations about companies.
A company has the following attributes:
* Company ID 
* Name
* Address
* City 
* Country
* E-mail (not required)
* Phone Number (not required)
* Beneficial owner(s)

The application is deloyed in heroku and can be accessed here: [https://companies-web-service.herokuapp.com/](https://companies-web-service.herokuapp.com/)

## Dependencies
The application is a RESTful createad using node.js with the follwoing packages:
* [expressjs](https://expressjs.com/) -> used for managing http requests
* [aws-sdk](https://aws.amazon.com/sdk-for-node-js/) -> used for aws s3 bucket file storage
* [cors](https://www.npmjs.com/package/cors) -> used for enableing cors in expressjs request
* [hsync-rpc](https://www.npmjs.com/package/sync-rpc) -> used for running asynchronous functions synchronously

# Available requests

## Get companies

|Method|Request|Description|
|:-:|:-:|:-:|
|GET|/companies|Returns a JSON array with the companies|

**Responses**

|Responses code|Response meaning|
|:-:|:-:|
|200|an array with companies|
|500|internal sever error|

**Response example:**

```
GET:/companies
```

**Response**

```json
[  
	{  
		"CompanyID":0,  
		"Name":"Company0",  
		"Address":"address0",  
		"City":"city0",  
		"Country":"country0",  
		"EMail":"test@company0",  
		"PhoneNumber":"+2123",  
		"BeneficialOwners":
		[  
			{  
			"FullName":"John Doe"  
			},  
			{  
			"FullName":"Jamie Doe"  
			}  
		]  
	},  
	{  
        "CompanyID":1,  
        "Name":"Company1",  
        "Address":"address1",  
        "City":"city1",  
        "Country":"country1",  
        "Email":"contact@company1.com",  
        "PhoneNumber":"+4323456",  
        "BeneficialOwners":[]  
	}  
]
```

**cURL command**

```
curl https://companies-web-service.herokuapp.com/companies
```

## Get a company

|Method|Request|Description|
|:-:|:-:|:-:|
|GET|/companies/companyID|Returns a JSON object with the company requested|

**Responses**

|Responses code|Response meaning|
|:-:|:-:|
|200|the company requested|
|400|invalid company id|
|404|company not found|
|500|internal sever error|

**Response example:**

```
GET:/companies/0
```

**Response**

```json
{
	"Name":"Company0",
	"Address":"address0",
	"City":"city0",
	"Country":"country0",
	"Email":"test@company0",
	"PhoneNumber":"+2123",
	"BeneficialOwners":
	[
		{"FullName":"John Doe"},
		{"FullName":"Jamie Doe"}
	]
}
```

**cURL command**

```
curl https://companies-web-service.herokuapp.com/companies/0
```

## Add a company

|Method|Request|Description|
|:-:|:-:|:-:|
|POST|/companies|Returns a JSON object with the company added|

This request requires the following header:

```
"content-type"="application/json"
```

The body for this request must respect the following structure:

```json
{
	"Name": "string value",
	"Address": "string value",
	"City": "string value",
	"Email": "string value",
	"PhoneNumber" "string value"
}
```

The "Emai" and "PhoneNumber" fields are **optional**. Other fields will be ignored.

**Responses**

|Responses code|Response meaning|
|:-:|:-:|
|201|the company added|
|400|invalid syntax|
|406|body is not JSON|
|406|max safe integer reached for company ID|
|500|internal sever error|

**Response example:**

```json
POST:/companies
Headers: "content-type"="application/json"
Body:
{
	"Name": "New company",
	"Address": "address",
	"City": "city",
	"Email": "email@newCompany.com",
	"PhoneNumber": "12341234"
}
```

**Response:**

```json
{
	"CompanyID": 2,
	"Name": "New company",
	"Address": "address",
	"City": "city",
	"Email": "email@newCompany.com",
	"PhoneNumber": "12341234",
	"BeneficialOwners": []
}
```

**cURL command**

```
curl https://companies-web-service.herokuapp.com/companies -d '{"Name":"New company","Address":"address","City":"city","Email":"email@newCompany.com","PhoneNumber":"12341234"}' -header "content-type: application/json" -X POST
```

## Update a company

|Method|Request|Description|
|:-:|:-:|:-:|
|PUT|/companies/companyID|Returns a JSON object with the company updated|

This request requires the following header:

```
"content-type"="application/json"
```

The body for this request must respect the following structure:

```json
{
	"Name": "string value",
	"Address": "string value",
	"City": "string value",
	"Email": "string value",
	"PhoneNumber" "string value"
}
```

The "Emai" and "PhoneNumber" fields are **optional**. Other fields will be ignored. If the uptaded company had the "Email" and/or "PhoneNumber" fields and the body of the request doesn't have them, theese will be erased.

**Responses**

|Responses code|Response meaning|
|:-:|:-:|
|200|the company updated|
|400|invalid syntax|
|400|invalid company ID|
|404|company not found|
|406|body is not JSON|
|406|max safe integer reached for company ID|
|500|internal sever error|

**Response example:**

```json
PUT:/companies/2
Headers: "content-type"="application/json"
Body:
{
	"Name": "Updated company",
	"Address": "address",
	"City": "city",
	"Email": "email@updatedCompany.com",
	"PhoneNumber": "12341234"
}
```

**Response:**

```json
{
	"CompanyID": 2,
	"Name": "Updated company",
	"Address": "address",
	"City": "city",
	"Email": "email@updatedCompany.com",
	"PhoneNumber": "12341234",
	"BeneficialOwners": []
}
```

**cURL command**

```
curl https://companies-web-service.herokuapp.com/companies/2 -d '{"Name":"Updated company","Address":"address","City":"city","Email":"email@updatedCompany.com","PhoneNumber":"12341234"}' -header "content-type: application/json" -X PUT
```

## Add a beneficial owner to a company

|Method|Request|Description|
|:-:|:-:|:-:|
|POST|/companies/companyID/<br>beneficialOwners|Returns a JSON object with the company updated (with the added beneficial owners)|

This request requires the following header:

```
"content-type"="application/json"
```

The body for this request must respect the following structure:

```json
[
	{
		"FullName": "string value"
	}
]
```

The object with the "Full name" field may appear multiple times so the user can add multiple beneficial owners in a request

**Responses**

|Responses code|Response meaning|
|:-:|:-:|
|200|the company updated|
|400|invalid syntax|
|400|invalid company ID|
|404|company not found|
|406|body is not JSON|
|406|max safe integer reached for company ID|
|500|internal sever error|

**Response example:**
```json
POST:/companies/2/beneficialOwners
Headers: "content-type"="application/json"
Body:
[
	{
		"FullName": "Beneficial owner 1"
	},
	{
		"FullName": "Beneficial owner 2"
	}
]
```

**Response:**

```json
{
	"CompanyID": 2,
	"Name": "Updated company",
	"Address": "address",
	"City": "city",
	"Email": "email@updatedCompany.com",
	"PhoneNumber": "12341234",
	"BeneficialOwners":
	[
		{
			"FullName": "Beneficial owner 1"
		},
		{
			"FullName": "Beneficial owner 2"
		}
	]
}
```

**cURL command**

```
curl https://companies-web-service.herokuapp.com/companies/2/beneficialOwners -d '[{"FullName":"Beneficial owner 1"},{"FullName":"Beneficial owner 2"}]' -header "content-type: application/json" -X POST
```

# Behind the code

The application listents on a port provided by heroku and responde to the requests that come on that port. It also stores/get the companies information from an amazon aws S3 bucket.
