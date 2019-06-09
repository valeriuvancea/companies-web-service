const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var companiesApi = require('./api/companies');
companiesApi.set(app);
var beneficialOwnersApi = require('./api/beneficialOwners');
beneficialOwnersApi.set(app);

app.listen(process.env.PORT || 80, () => console.log(`App started and listenting on port ${port}`));