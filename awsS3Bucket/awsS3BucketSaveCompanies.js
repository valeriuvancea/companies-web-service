const awsS3Bucket = require('./awsS3Bucket')
function saveCompaniesToS3Bucket()
{
    return async(companies) => 
    {
        var options = {
            Body: JSON.stringify(companies),
            Bucket: process.env.S3_BUCKET,
            Key: "companies.json",
        };
        await awsS3Bucket.s3.putObject(options, (err,data) =>
        {
            if (err) 
            {
                throw (err + "\n" + err.stack);
            }
            console.log(data + "\nSuceessfully stored companies"); 
        }).promise();
    }
}
module.exports = saveCompaniesToS3Bucket;