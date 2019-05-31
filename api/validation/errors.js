module.exports = {
    errorMessageForCompanyWithIDDoesNotExist: function (companyID)
    {
        return generateErrorObject([`The company with id ${companyID} doesn't exist`]);
    },
    errorMessageForInvalidCompanyID: function (companyID)
    {
        return generateErrorObject([`The id ${companyID} is not a positive integer. Please enter a valid id!`]);
    },
    errorMessageForBodyContentIsNotJson: function ()
    {
        return generateErrorObject(["The body content must be JSON. Please use the header 'contet-type' with the value 'application/json'"]);
    },
    generateErrorObject: generateErrorObject 
};

function generateErrorObject (messages)
{
    var object = new Object();
    object.errors = new Array();
    messages.forEach(element => 
    {
        object.errors.push(element);
    });
    return object;
}