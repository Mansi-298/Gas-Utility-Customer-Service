import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';

function Dashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    urgent: 0,
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/service-requests/my-requests');
      setRequests(response.data);

      // Calculate stats
      const total = response.data.length;
      const resolved = response.data.filter((req) => req.status === 'resolved').length;
      const pending = response.data.filter((req) => ['new', 'assigned', 'in_progress'].includes(req.status)).length;
      const urgent = response.data.filter((req) => req.priority === 'urgent').length;

      setStats({ total, resolved, pending, urgent });
    } catch (error) {
      if (error.response?.status !== 401) { // 401 is handled by axios interceptor
        toast.error('Error fetching service requests');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'info',
      assigned: 'warning',
      in_progress: 'primary',
      resolved: 'success',
      closed: 'default',
    };
    return colors[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'success',
      medium: 'info',
      high: 'warning',
      urgent: 'error',
    };
    return colors[priority] || 'default';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {/* Stats Cards */}
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssignmentIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4">{stats.total}</Typography>
                    <Typography color="textSecondary">Total Requests</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleIcon sx={{ mr: 2, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h4">{stats.resolved}</Typography>
                    <Typography color="textSecondary">Resolved</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ScheduleIcon sx={{ mr: 2, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="h4">{stats.pending}</Typography>
                    <Typography color="textSecondary">Pending</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <WarningIcon sx={{ mr: 2, color: 'error.main' }} />
                  <Box>
                    <Typography variant="h4">{stats.urgent}</Typography>
                    <Typography color="textSecondary">Urgent</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Requests */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Service Requests</Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/create-request')}
                >
                  New Request
                </Button>
              </Box>
              <List>
                {requests.slice(0, 5).map((request, index) => (
                  <Box component="div" key={request._id}>
                    {index > 0 && <Divider />}
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography component="span" variant="subtitle1">
                              {request.type.replace(/_/g, ' ').toUpperCase()}
                            </Typography>
                            <Chip
                              size="small"
                              label={request.status}
                              color={getStatusColor(request.status)}
                            />
                            <Chip
                              size="small"
                              label={request.priority}
                              color={getPriorityColor(request.priority)}
                            />
                          </Box>
                        }
                        secondaryTypographyProps={{ component: 'div' }}
                        secondary={
                          <Stack spacing={1}>
                            <Typography component="span" variant="body2" color="textSecondary">
                              {request.description}
                            </Typography>
                            <Typography component="span" variant="caption" color="textSecondary">
                              Created: {formatDate(request.createdAt)}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
                {requests.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primaryTypographyProps={{ component: 'span' }}
                      primary="No service requests found"
                      secondaryTypographyProps={{ component: 'span' }}
                      secondary="Click 'New Request' to create one"
                    />
                  </ListItem>
                )}
              </List>
              {requests.length > 5 && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="text"
                    onClick={() => navigate('/service-requests')}
                  >
                    View All Requests
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard; 