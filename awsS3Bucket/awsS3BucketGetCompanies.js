const awsS3Bucket = require('./awsS3Bucket')
var options = {
    Bucket: process.env.S3_BUCKET,
    Key: "companies.json"
};

function getCompaniesFromS3Bucket()
{
    return async() => 
    {
        const data = await awsS3Bucket.s3.getObject(options, (err,data) =>
        {
            if (err) 
            {
                throw (err + "\n" + err.stack);
            }
            return data;
        }).promise();
        return JSON.parse(data.Body.toString('utf-8'));
    }
}
module.exports = getCompaniesFromS3Bucket;