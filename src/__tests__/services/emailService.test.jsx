import { sendCVEmail, sendPasswordResetEmail, sendAdminNotification } from '../../services/emailService';

// Mock Firebase Analytics
jest.mock('../../firebase/config', () => ({
  analytics: {
    logEvent: jest.fn()
  }
}));

// Mock fetch
global.fetch = jest.fn();

describe('Email Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  describe('sendCVEmail', () => {
    test('sends CV email successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({ success: true })
      };
      fetch.mockResolvedValue(mockResponse);

      const result = await sendCVEmail(
        'test@example.com',
        'Test User',
        { personalInfo: { fullName: 'Test User' } },
        'modern'
      );

      expect(result.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith('/api/send-email', expect.any(Object));
    });

    test('handles email sending error gracefully', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      const result = await sendCVEmail(
        'test@example.com',
        'Test User',
        { personalInfo: { fullName: 'Test User' } },
        'modern'
      );

      expect(result.success).toBe(true);
      expect(result.fallback).toBe(true);
    });
  });

  describe('sendPasswordResetEmail', () => {
    test('sends password reset email successfully', async () => {
      const result = await sendPasswordResetEmail('test@example.com');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Password reset email sent!');
    });
  });

  describe('sendAdminNotification', () => {
    test('sends admin notification successfully', async () => {
      const requestData = {
        id: '1',
        userEmail: 'test@example.com',
        userName: 'Test User'
      };

      const result = await sendAdminNotification(requestData);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Admin notified successfully!');
    });
  });
});
