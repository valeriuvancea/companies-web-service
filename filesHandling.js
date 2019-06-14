const fs = require('fs');
const forceSync = require('sync-rpc')
module.exports = {
    readFile: readFile,
    addCompanyToCompanies: function (company, companies) 
    {
        companies.push(company);
        companies.sort((a,b)  => 
        {
            return a.CompanyID - b.CompanyID;
        });
        saveCompanies(companies);
    },
    updateCompanyWithIndexFromCompanies: function (company, index, companies)
    {        
        if(companies[index] == undefined)
        {
            thorw `Company with index ${index} doesn't exist!`;
        }
        companies[index] = company;
        saveCompanies(companies);
    },
    readCompanies: function ()
    {
        return readCompanies().sort((a,b)  => 
        {
            return a.CompanyID - b.CompanyID;
        })
    }
}

function saveCompanies (companies)
{
    var syncSaveFunction = forceSync(require.resolve('./awsS3Bucket/awsS3BucketSaveCompanies'));
    syncSaveFunction(companies);
}

function readCompanies()
{
    var syncReadFunction = forceSync(require.resolve('./awsS3Bucket/awsS3BucketGetCompanies'));
    return syncReadFunction();
}

function readFile(file)
{
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}
