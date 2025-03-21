import { S3Client } from '@aws-sdk/client-s3'

export const S3 = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: `${process.env.NEXT_PUBLIC_ACCESSKEYID}`,
    secretAccessKey: `${process.env.NEXT_PUBLIC_PRIVATE_ACCESSKEY}`,
    sessionToken: `${process.env.NEXT_PUBLIC_AWS_TOKEN}`,
  },
})
