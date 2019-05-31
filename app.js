const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

var companiesApi = require('./api/companies');
companiesApi.set(app);
var beneficialOwnersApi = require('./api/beneficialOwners');
beneficialOwnersApi.set(app);

app.listen(port, () => console.log(`App started and listenting on port ${port}`));