var fileHandler = require('../../filesHandling');
module.exports = {
    getCompanyFromBody: function (body)
    {
        var returnValue = new Object();
        returnValue.company = new Object();
        returnValue.errors = new Array();
        var companyStructure = fileHandler.readFile('company-structure.json');

        Object.getOwnPropertyNames(companyStructure).forEach((property, idx, array) => 
        {
            var isPropertyOptional = false;
            isPropertyOptional = companyStructure[property].isOptional;
            if (objectHasProperty(body, property))
            {
                if (propertyOfObjectIsTypeOf(property, body, companyStructure[property].type))
                {
                    returnValue.company[property]= new Object();
                    returnValue.company[property] = body[property];
                }
                else
                {
                    returnValue.errors.push(`The the value of the property ${property} isn't ${companyStructure[property]}. ` +
                    `Please use a ${companyStructure[property]} value for the property ${property}`);
                }
            }
            else if(!isPropertyOptional)
            {
                returnValue.errors.push(`The received body doesn't have the ${property} property. ` +
                `Please add a property ${property} with a ${companyStructure[property]} value.`);
            }
        });  
        return returnValue;
    },
    getBeneficialOwnersFromBody: function (body)
    {
        var returnValue = new Object();
        returnValue.beneficialOwners = new Array();
        returnValue.errors = new Array();
        
        if(Array.isArray(body))
        {
            body.forEach(element => 
            {
                if(Object.keys(element).length == 1)
                {
                    if (element.FullName != undefined)
                    {
                        if (typeof element.FullName == "string")
                        {
                            returnValue.beneficialOwners.push(element);
                        }
                        else
                        {
                            returnValue.errors.push(`The property 'FullName' of element with index ${body.indexOf(element)} is not string. ` + 
                            `Please use exactly one property named 'FullName' with a string value`);
                        }
                    }
                    else
                    {
                        returnValue.errors.push(`Element with index ${body.indexOf(element)} doens't have a property named 'FullName'. ` + 
                        `Please use exactly one property named 'FullName' with a string value`);
                    }
                }
                else
                {
                    returnValue.errors.push(`Element with index ${body.indexOf(element)} doens't have exactly one property. ` + 
                    `Please use exactly one property named 'FullName' with a string value`);
                }
            });
        }
        else
        {
            returnValue.errors.push(`The received body isn't an array.`);
        }
        return returnValue;
    },
    isCompanyIdValid: function (companyID)
    {
        if (companyID == parseInt(companyID) && companyID >= 0)
        {
            return true;
        }
        return false;
    },
    findCompanyWithIdInCompanies: function (companyID,companies)
    {
        return companies.find((element) =>
        {
            return element.CompanyID == companyID;
        });
    },
    isRequestContentJson: function (request)
    {
        if(request.body != undefined && request.headers['content-type'] == 'application/json')
        {
            return true;
        }
        return false;
    }
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