const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.json());

var companies = readFile('companies.json');

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
    if (companyID != parseInt(companyID) || companyID < 0)
    {
        res.send(generateErrorObject([`The id ${companyID} is not a positive integer. Please enter a valid id!`]));
    }
    else
    {
        var companyFound = companies.find((element) =>
        {
            return element.ID == companyID;
        });
        if (companyFound == undefined)
        {
            res.json(generateErrorObject([`The company with the id ${companyID} doesn't exist`]));
        }
        else 
        {
            delete companyFound.ID;
            res.json(companyFound);
        }
    }
});

app.put('/companies/:companyID', (req, res) => 
{
    var received = req.body;
    if (received == undefined || req.headers['content-type'] != 'application/json')
    {
        res.json(generateErrorObject(["The body content must be JSON. Please use the header 'contet-type' with the value 'application/json'"]));
    }
    else 
    {
        var companyID = req.params['companyID'];
        var companyFound = companies.find((element) =>
        {
            return element.ID == companyID;
        });
        var object = getCompanyFromObject(received);
        if(object.errors.length == 0)
        {     
            object.company = {"ID": companyID, ...object.company};
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
});

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
    var companyFound = companies.find((element) =>
    {
        return element.ID == index;
    });
    if (companyFound != undefined)
    {
        companies[index] = company;
        saveCompanies();
    }
}

function saveCompanies()
{
    fs.writeFile('companies.json', JSON.stringify(companies), (err) => 
    {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}