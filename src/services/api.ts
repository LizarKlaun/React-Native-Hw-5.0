import { UserData, AuthResponse } from '../types';

export const generateTokenApi = async (userData: UserData): Promise<AuthResponse> => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    ...userData,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const base64Header = btoa(JSON.stringify(header));
  const base64Payload = btoa(JSON.stringify(payload));
  const mockSignature = 'mock_signature_hash';

  const token = `${base64Header}.${base64Payload}.${mockSignature}`;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        token,
        user: userData,
      });
    }, 800);
  });
};