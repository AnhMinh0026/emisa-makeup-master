import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, Title, TextInput, PasswordInput, Button, Text } from '@mantine/core';
import { authApi } from '../api/authApi.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/admin');
      } else {
        setError('Login failed: No token received.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" className="mantine-Title-root" style={{ fontFamily: 'var(--font-heading)', fontWeight: 900 }}>
        Admin Login
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="0" style={{ border: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
        <form onSubmit={handleLogin}>
          <TextInput
            label="Email"
            placeholder="admin@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            radius="0"
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            radius="0"
          />

          {error && (
            <Text c="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Button fullWidth mt="xl" type="submit" color="dark" radius="0" loading={loading}>
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
