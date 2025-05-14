import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';

function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', formData);
      const { token, user } = response.data;

      if (!token) {
        throw new Error('No token received from server');
      }

      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Set default auth header
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      console.log('Login successful, token:', token);
      console.log('User data:', user);

      toast.success('Login successful!');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      // Clear any invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.grey[100],
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto',
        padding: theme.spacing(2),
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: isSmallScreen ? '100%' : '450px',
          p: { xs: 3, sm: 6 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'white',
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          m: 'auto',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: theme.palette.primary.main,
          },
        }}
      >
        <Typography
          component="h1"
          variant={isSmallScreen ? 'h4' : 'h3'}
          sx={{
            mb: 1,
            color: theme.palette.primary.main,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          component="h2"
          variant="h6"
          sx={{
            mb: 4,
            color: theme.palette.text.secondary,
            textAlign: 'center',
            width: '100%',
          }}
        >
          Gas Utility Service Portal
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            mt: 1,
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                fontSize: isSmallScreen ? '1rem' : '1.1rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: isSmallScreen ? '1rem' : '1.1rem',
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                fontSize: isSmallScreen ? '1rem' : '1.1rem',
              },
              '& .MuiInputLabel-root': {
                fontSize: isSmallScreen ? '1rem' : '1.1rem',
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 3,
              py: 1.8,
              fontSize: isSmallScreen ? '1rem' : '1.2rem',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              '&:hover': {
                boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
              },
            }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link
              component={RouterLink}
              to="/register"
              variant="body1"
              sx={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontSize: isSmallScreen ? '1rem' : '1.1rem',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login; 