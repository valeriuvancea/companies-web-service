const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
app.use(express.json());

var companies;

app.get('/', (req,res) =>
{
    readFile();
    console.log(companies);
    res.json("done");
})

function readFile()
{
    fs.readFileSync('companies.json', 'utf8', (err, data) => 
    {
        if (err) 
        {
            return err;
        }
        companies = JSON.parse(data);
    }); 
}

app.get('/companies', (req, res) =>
{
    fs.readFile('companies.json', 'utf8', (err, data) => 
    {
        if (err) 
        {
            return res.send(err);
        }
        res.send(JSON.parse(data));
    });
});

app.get('/company/:companyID', (req, res) =>
{
    var companyID = req.params['companyID'];
    if (companyID != parseInt(companyID) || companyID < 0)
    {
        res.send(getErrorObject([`The id ${companyID} is not a positive integer. Please enter a valid id!`]));
    }
    else
    {
        fs.readFile('companies.json', 'utf8', (err, data) => 
        {
            if (err) 
            {
                return err;
            }
            var companies = JSON.parse(data);
            var comapnyFound = companies.find((element) =>
            {
                return element.ID == companyID;
            });
            if (comapnyFound == undefined)
            {
                res.status = 
                res.json(getErrorObject([`The company with the id ${companyID} doesn't exist`]));
            }
            else 
            {
                res.json(comapnyFound);
            }
        });
    }
});

app.put('/company/:companyID', (req, res) => 
{
    var received = req.body;
    if (received == undefined)
    {
        res.json(getErrorObject(["To update a company use its information in the body as JSON an change the information there!"]));
    }
    else if (received.constructor !== {}.constructor)
    {
        res.json(getErrorObject(["The information given in the body is not a simple JSON object!"]));
    }
    else 
    {
        var companyID = req.params['companyID'];
        fs.readFile('companies.json', 'utf8', (err, data) => 
        {
            if (err) 
            {
                return err;
            }
            var companies = JSON.parse(data);
            var comapnyFound = companies.find((element) =>
            {
                return element.ID == companyID;
            });
            if (comapnyFound == undefined)
            {
                res.status = 
                res.json(getErrorObject([`The company with the id ${companyID} doesn't exist`]));
            }
            else 
            {
                res.json(comapnyFound);
            }
        }); 
    }
    res.send("done");
});

app.listen(port, () => console.log(`App started and listenting on port ${port}`));

function getErrorObject(messages)
{
    var object = new Object();
    object.errors = new Array();
    messages.forEach(element => 
    {
        object.errors.push(element);
    });
    return object;
}
