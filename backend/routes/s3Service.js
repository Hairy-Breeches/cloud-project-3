const S3 = require('aws-sdk');
const AWS = require('./awsConfig.js');

const s3UploadV2 = async (file, fileName) => {
  const s3 = new AWS.S3();

  const param = {
    Bucket: 'cloud-cp',
    Key: `uploads/${fileName}`,
    Body: file.buffer
  }

  return await s3.upload(param).promise()
}

module.exports = s3UploadV2
