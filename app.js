const express = require('express');
const app = express();
const cors = require('cors')
const port = process.env.PORT || 80;
app.use(express.json());
app.use(cors());

var companiesApi = require('./api/companies');
companiesApi.set(app);
var beneficialOwnersApi = require('./api/beneficialOwners');
beneficialOwnersApi.set(app);

app.listen(port, () => console.log(`App started and listenting on port ${port}`));