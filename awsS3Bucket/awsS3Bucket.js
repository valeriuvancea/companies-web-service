const aws = require('aws-sdk')
aws.config.update (
    {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'eu-west-3'
    }
);
module.exports =
{
    s3 : new aws.S3()
}