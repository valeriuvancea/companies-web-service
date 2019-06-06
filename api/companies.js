var validation = require('./validation/validation');
var errors = require('./validation/errors');
var fileHandler = require('../filesHandling');
var companies = fileHandler.readFile('companies.json').sort((a,b)  => 
{
    return a.CompanyID - b.CompanyID;
});
module.exports.set = function(app) {
    app.get('/', (req, res) =>
    {
        res.set('Access-Control-Allow-Origin', '*');
        res.statusMessage = "Page not found";
        res.statusCode = 404;//NOT FOUND
        res.json('Page not found');
    });

    app.get('/companies', (req, res) =>
    {
        res.set('Access-Control-Allow-Origin', '*');
        res.json(companies);
    });

    app.get('/companies/:companyID', (req, res) =>
    {
        res.set('Access-Control-Allow-Origin', '*');
        var companyID = req.params['companyID'];
        if (validation.isCompanyIdValid(companyID))
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
                delete companyFound.CompanyID;
                res.json(companyFound);
            }
        }
        else
        {    
            res.statusMessage = "Invalid company ID";
            res.statusCode = 400;//BAD REQUEST   
            res.json(errors.errorMessageForInvalidCompanyID(companyID));
        }
    });

    app.post('/companies', (req, res) =>
    {
        res.set('Access-Control-Allow-Origin', '*');
        if (validation.isRequestContentJson(req))
        {
            var body = req.body;
            var object = validation.getCompanyFromBody(body);
            if(object.errors.length == 0)
            {     
                var companyID = Number(companies[companies.length-1].CompanyID) + 1;
                object.company = {"CompanyID": companyID, ...object.company,"BeneficialOwners": []};
                fileHandler.addCompanyToCompanies(object.company, companies);
                res.statusCode = 201;//CREATED
                res.json(object.company);
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
    })

    app.put('/companies/:companyID', (req, res) => 
    {
        res.set('Access-Control-Allow-Origin', '*');
        var companyID = req.params['companyID'];
        if (validation.isCompanyIdValid(companyID))
        {
            if (validation.isRequestContentJson(req))
            {
                var object = validation.getCompanyFromBody(req.body);
                if(object.errors.length == 0)
                {   
                    var companyFound = validation.findCompanyWithIdInCompanies(companyID,companies);                 
                    object.company = {"CompanyID": Number(companyID), ...object.company};
                    if (companyFound == undefined)
                    {  
                        object.company.BeneficialOwners = [];
                        fileHandler.addCompanyToCompanies(object.company, companies);            
                        res.statusMessage = "The company has been created";
                        res.statusCode = 201;//CREATED
                    }
                    else
                    {
                        object.company.BeneficialOwners = new Array();
                        object.company.BeneficialOwners = companyFound.BeneficialOwners;
                        fileHandler.updateCompanyWithIndexFromCompanies(object.company,companies.indexOf(companyFound),companies);
                        res.statusMessage = "The company has been updated"
                    }
                    res.json(object.company);
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
    });
}