const AWS = require('aws-sdk');


AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: 'AKIASHHEGQE5WTLVTU42',
  secretAccessKey: '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',
});

module.exports = AWS;
