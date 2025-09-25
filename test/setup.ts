import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock Auth0 for testing
jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn(() => 'test-secret'),
}));

// Global test timeout
jest.setTimeout(30000);
