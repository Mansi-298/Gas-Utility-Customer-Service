import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Edit as EditIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [supportStaff, setSupportStaff] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    urgent: 0,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsResponse, staffResponse] = await Promise.all([
        axiosInstance.get('/service-requests/all'),
        axiosInstance.get('/users?role=support'),
      ]);

      setRequests(requestsResponse.data);
      setSupportStaff(staffResponse.data);

      // Calculate stats
      const total = requestsResponse.data.length;
      const resolved = requestsResponse.data.filter((req) => req.status === 'resolved').length;
      const pending = requestsResponse.data.filter((req) => ['new', 'assigned', 'in_progress'].includes(req.status)).length;
      const urgent = requestsResponse.data.filter((req) => req.priority === 'urgent').length;

      setStats({ total, resolved, pending, urgent });
    } catch (error) {
      toast.error('Error fetching data');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleUpdateRequest = async () => {
    setLoading(true);
    try {
      await axiosInstance.patch(`/service-requests/${selectedRequest._id}/status`, {
        status: selectedRequest.status,
      });

      if (selectedRequest.assignedTo) {
        await axiosInstance.patch(`/service-requests/${selectedRequest._id}/assign`, {
          assignedTo: selectedRequest.assignedTo,
        });
      }

      toast.success('Request updated successfully');
      setDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error('Error updating request');
    } finally {
      setLoading(false);
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
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
        </Grid>

        {/* Service Requests Table */}
        <Paper sx={{ mb: 4 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <TableRow key={request._id}>
                      <TableCell>
                        {request.customerId?.firstName} {request.customerId?.lastName}
                      </TableCell>
                      <TableCell>
                        {request.type.replace(/_/g, ' ').toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={request.status}
                          color={getStatusColor(request.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={request.priority}
                          color={getPriorityColor(request.priority)}
                        />
                      </TableCell>
                      <TableCell>
                        {request.assignedTo ? (
                          `${request.assignedTo.firstName} ${request.assignedTo.lastName}`
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Unassigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleEditRequest(request)}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={requests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Edit Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Update Service Request</DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedRequest.status}
                    onChange={(e) =>
                      setSelectedRequest({
                        ...selectedRequest,
                        status: e.target.value,
                      })
                    }
                    label="Status"
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="assigned">Assigned</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Assign To</InputLabel>
                  <Select
                    value={selectedRequest.assignedTo?._id || ''}
                    onChange={(e) =>
                      setSelectedRequest({
                        ...selectedRequest,
                        assignedTo: e.target.value,
                      })
                    }
                    label="Assign To"
                  >
                    <MenuItem value="">
                      <em>Unassigned</em>
                    </MenuItem>
                    {supportStaff.map((staff) => (
                      <MenuItem key={staff._id} value={staff._id}>
                        {staff.firstName} {staff.lastName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateRequest} disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default AdminDashboard; 