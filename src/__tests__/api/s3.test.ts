import handler from '@/app/api/aws/s3/upload'
import { createMocks } from 'node-mocks-http'

// Mock do AWS SDK
jest.mock('@aws-sdk/client-s3', () => {
  const originalModule = jest.requireActual('@aws-sdk/client-s3')
  return {
    ...originalModule,
    S3Client: jest.fn(() => ({
      send: jest.fn(() =>
        Promise.resolve({ Buckets: [{ Name: 'estoqueisi2025' }] }),
      ),
    })),
  }
})

describe('API Route: /api/s3', () => {
  it('should return the correct bucket name if the connection is OK', async () => {
    const { req, res } = createMocks()

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)

    const response = JSON.parse(res._getData())

    expect(response.buckets).toEqual([{ Name: 'estoqueisi2025' }])
  })
})
