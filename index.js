const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.json());

var companies = readFile('companies.json').sort((a,b)  => 
{
    return a.CompanyID - b.CompanyID;
});

function readFile(file)
{
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

app.get('/companies', (req, res) =>
{
    res.send(companies);
});

app.get('/companies/:companyID', (req, res) =>
{
    var companyID = req.params['companyID'];
    if (isCompanyIdValid(companyID))
    {
        var companyFound = findCompanyWithId(companyID);
        if (companyFound == undefined)
        {
            res.json(generateErrorObject([`The company with id ${companyID} doesn't exist`]));
        }
        else 
        {
            delete companyFound.CompanyID;
            res.json(companyFound);
        }
    }
    else
    {       
        res.send(generateErrorObject([`The id ${companyID} is not a positive integer. Please enter a valid id!`]));
    }
});

app.post('/companies', (req, res) =>
{
    if (isRequestContentJson(req))
    {
        var body = req.body;
        var object = getCompanyFromObject(body);
        if(object.errors.length == 0)
        {     
            var companyID = companies[companies.length-1].CompanyID + 1;
            object.company = {"CompanyID": companyID, ...object.company};
            addCompany(object.company);
            res.statusCode = 201;//CREATED
            res.json(object.company);
        }
        else
        {
            res.json(generateErrorObject(object.errors));
        }
    }
    else 
    {
        res.json(generateErrorObject(["The body content must be JSON. Please use the header 'contet-type' with the value 'application/json'"])); 
    }
})

app.put('/companies/:companyID', (req, res) => 
{
    var companyID = req.params['companyID'];
    if (isCompanyIdValid(companyID))
    {
        if (isRequestContentJson(req))
        {
            var body = req.body;
            var object = getCompanyFromObject(body);
            if(object.errors.length == 0)
            {     
                object.company = {"CompanyID": companyID, ...object.company};
                var companyFound = findCompanyWithId(companyID);
                if (companyFound == undefined)
                {  
                    addCompany(object.company);
                }
                else
                {
                    updateCompanyWithIndex(object.company,companies.indexOf(companyFound));
                }
                res.json(object.company);
            }
            else
            {
                res.json(generateErrorObject(object.errors));
            }
        }
        else 
        {
            res.json(generateErrorObject(["The body content must be JSON. Please use the header 'contet-type' with the value 'application/json'"])); 
        }
    }
    else
    {       
        res.send(generateErrorObject([`The id ${companyID} is not a positive integer. Please enter a valid id!`]));
    }
});

app.post('/companies/:companyID/beneficialOwners', (req,res) =>
{

})

app.listen(port, () => console.log(`App started and listenting on port ${port}`));

function generateErrorObject(messages)
{
    var object = new Object();
    object.errors = new Array();
    messages.forEach(element => 
    {
        object.errors.push(element);
    });
    return object;
}

function getCompanyFromObject(object)
{
    var returnValue = new Object();
    returnValue.company = new Object();
    returnValue.errors = new Array();
    var companyStructure = readFile('company-structure.json');

    Object.getOwnPropertyNames(companyStructure).forEach((property, idx, array) => 
    {
        var isPropertyOptional = false;
        isPropertyOptional = companyStructure[property].isOptional;
        if (objectHasProperty(object, property))
        {
            if (propertyOfObjectIsTypeOf(property, object, companyStructure[property].type))
            {
                returnValue.company[property]= new Object();
                returnValue.company[property] = object[property];
            }
            else
            {
                returnValue.errors.push(`The the value of the property ${property} isn't ${companyStructure[property]}.` +
                `Please use a ${companyStructure[property]} value for the property ${property}`);
            }
        }
        else if(!isPropertyOptional)
        {
            returnValue.errors.push(`The received object doesn't have the ${property} property! Please add a property ${property} with a string value.`);
        }
    });  
    return returnValue;
}


function objectHasProperty(object,property)
{
    if(object.hasOwnProperty(property))
    {
        return true;
    }
    return false;
}

function propertyOfObjectIsTypeOf(property,object,type)
{
    if(typeof object[property] === type)
    {
        return true;
    }
    return false;
}

function addCompany(company) 
{
    companies.push(company);
    saveCompanies();
}

function updateCompanyWithIndex(company,index)
{        
    if(companies[index] == undefined)
    {
        thorw `Company with index ${index} doesn't exist!`;
    }
    companies[index] = company;
    saveCompanies();
}

function saveCompanies()
{
    fs.writeFile('companies.json', JSON.stringify(companies), (err) => 
    {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}

function isCompanyIdValid(companyID)
{
    if (companyID == parseInt(companyID) && companyID >= 0)
    {
        return true;
    }
    return false;
}

function findCompanyWithId(companyID)
{
    return companies.find((element) =>
    {
        return element.CompanyID == companyID;
    });
}

function isRequestContentJson(request)
{
    if(request.body != undefined && request.headers['content-type'] == 'application/json')
    {
        return true;
    }
    return false;
}