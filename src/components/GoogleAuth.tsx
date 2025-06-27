// Alternative GoogleAuth.tsx
import { GoogleLogin, googleLogout } from '@react-oauth/google';

const GoogleAuth = ({ onSuccess }: GoogleAuthProps) => {
  return (
    <GoogleLogin
      onSuccess={({ credential }) => {
        // Send credential to your backend for verification
        fetch('/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: credential }),
        })
        .then(res => res.json())
        .then(data => onSuccess(data.user));
      }}
      onError={() => {
        console.error('Login Failed');
      }}
    />
  );
};