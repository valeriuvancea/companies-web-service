const fs = require('fs');
module.exports = {
    readFile: function (file)
    {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    },
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
    }
}

function saveCompanies (companies)
{
    fs.writeFile('companies.json', JSON.stringify(companies), (err) => 
    {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}
