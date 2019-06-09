var validation = require('./validation/validation');
var errors = require('./validation/errors');
var fileHandler = require('../filesHandling');
var companies = fileHandler.readFile('companies.json').sort((a,b)  => 
{
    return a.CompanyID - b.CompanyID;
});
module.exports.set = function(app) {
    app.post('/companies/:companyID/beneficialOwners', (req,res) =>
    {
        var companyID = req.params['companyID'];
        if (validation.isCompanyIdValid(companyID))
        {
            if (validation.isRequestContentJson(req))
            {
                var object = validation.getBeneficialOwnersFromBody(req.body);
                if(object.errors.length == 0)
                {   
                    var companyFound = validation.findCompanyWithIdInCompanies(companyID,companies);
                    if (companyFound == undefined)
                    {                        
                        res.statusMessage = "Company not found";
                        res.statusCode = 404;//NOT FOUND 
                        res.json(errors.errorMessageForCompanyWithIDDoesNotExist(companyID));
                    }
                    else
                    {
                        companyFound.BeneficialOwners = companyFound.BeneficialOwners.concat(object.beneficialOwners);                  
                        var company = {"CompanyID": Number(companyID), ...companyFound};
                        fileHandler.updateCompanyWithIndexFromCompanies(company,companies.indexOf(companyFound),companies);               
                        res.statusMessage = "The company has been updated";
                        res.statusCode = 201;//CREATED
                        res.json(company);
                    }
                }
                else
                {
                    res.statusMessage = "Invalid syntax";
                    res.statusCode = 400;//BAD REQUEST
                    res.json(errors.generateErrorObject(object.errors));
                }
            }
            else 
            {
                res.statusMessage = "Body is not JSON";
                res.statusCode = 406;//NOT ACCEPTABLE
                res.json(errors.errorMessageForBodyContentIsNotJson()); 
            }
        }   
        else
        {    
            res.statusMessage = "Invalid company ID";
            res.statusCode = 400;//BAD REQUEST 
            res.json(errors.errorMessageForInvalidCompanyID(companyID));
        }
    })
}