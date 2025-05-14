import { useState, useEffect } from 'react';
import {
  Container,
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
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axios';

function ServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axiosInstance.get('/service-requests/my-requests');
      setRequests(response.data);
    } catch (error) {
      toast.error('Error fetching service requests');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleOpenCommentDialog = (request) => {
    setSelectedRequest(request);
    setCommentDialogOpen(true);
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/service-requests/${selectedRequest._id}/comments`, {
        text: comment,
      });

      toast.success('Comment added successfully');
      setCommentDialogOpen(false);
      setComment('');
      fetchRequests();
    } catch (error) {
      toast.error('Error adding comment');
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
        <Typography variant="h5" gutterBottom>
          Service Requests
        </Typography>
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((request) => (
                    <TableRow key={request._id}>
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
                      <TableCell>{formatDate(request.createdAt)}</TableCell>
                      <TableCell>{formatDate(request.updatedAt)}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(request)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenCommentDialog(request)}
                        >
                          <CommentIcon />
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

        {/* Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Request Details</DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Type: {selectedRequest.type.replace(/_/g, ' ').toUpperCase()}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Description: {selectedRequest.description}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Location: {selectedRequest.location?.address}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Created: {formatDate(selectedRequest.createdAt)}
                </Typography>
                {selectedRequest.resolvedAt && (
                  <Typography variant="body2" gutterBottom>
                    Resolved: {formatDate(selectedRequest.resolvedAt)}
                  </Typography>
                )}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Comments:</Typography>
                  {selectedRequest.comments?.map((comment, index) => (
                    <Paper key={index} sx={{ p: 1, mt: 1 }}>
                      <Typography variant="body2">{comment.text}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Comment Dialog */}
        <Dialog
          open={commentDialogOpen}
          onClose={() => setCommentDialogOpen(false)}
        >
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Comment"
              fullWidth
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCommentDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddComment} disabled={loading}>
              {loading ? 'Adding...' : 'Add Comment'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default ServiceRequests; 