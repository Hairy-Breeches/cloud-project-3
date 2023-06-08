const S3 = require('aws-sdk');
const AWS = require('./awsConfig.js');

const s3UploadV2 = async (fileName) => {
  const s3 = new AWS.S3();

  const param = {
    Bucket: 'cloud-cp',
    Key: `uploads/${fileName}`,
    Body: file.buffer
  }

  return s3.putObject(param).promise()
    .then(response => response)
    .catch(error => {
      console.error('Error uploading file:', error);
      return null;
    });
}

module.exports = s3UploadV2
