import AWS from 'aws-sdk';
import snakeCase from 'lodash/snakeCase';

// configuring the AWS environment
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SK,
});
// initialize s3
const s3 = new AWS.S3();

class AwsService {
  static async uploadFile(file, data) {
    const parameters = {
      Bucket: process.env.AWS_BUCKET,
      Body: data,
      Key: `${Date.now()}_${snakeCase(file.name)}`,
    };
    return s3.upload(parameters).promise();
  }

  static async deleteFile(key) {
    const parameters = { Bucket: process.env.AWS_BUCKET, Key: key };
    return s3.deleteObject(parameters).promise();
  }
}
export default AwsService;
