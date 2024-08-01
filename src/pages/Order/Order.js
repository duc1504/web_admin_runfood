import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        // Lấy danh sách đơn hàng từ API
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://backend-runfood.vercel.app/order');
                setOrders(response.data.data);
            } catch (error) {
                console.error('Đã xảy ra lỗi khi lấy danh sách đơn hàng:', error);
            }
        };

        fetchOrders();
    }, []);

    // Hàm để tạo file PDF cho một đơn hàng
    const generatePDF = (order) => {
        const doc = new jsPDF();
        doc.text(`Order ID: ${order._id}`, 10, 10);
        doc.text(`Customer Name: ${order.customerName}`, 10, 20);
        doc.text(`Customer Phone: ${order.customerPhone}`, 10, 30);
        doc.text(`Customer Address: ${order.customerAddress}`, 10, 40);
        doc.text(`Status: ${order.status}`, 10, 50);
        doc.text(`Note: ${order.note}`, 10, 60);
        doc.text(`Created At: ${new Date(order.createdAt).toLocaleString()}`, 10, 70);

        const products = order.products.map((product, index) => [
            index + 1,
            product.product,
            product.quantity
        ]);

        doc.autoTable({
            head: [['#', 'Product', 'Quantity']],
            body: products,
            startY: 80
        });

        doc.save(`order_${order._id}.pdf`);
    };

    // Hàm để cập nhật trạng thái đơn hàng
    const updateOrderStatus = async (orderId, status) => {
        try {
            const response = await axios.put(`https://backend-runfood.vercel.app/order/${orderId}`, { status });
            const updatedOrder = response.data.data;
            setOrders(orders.map(order => order._id === orderId ? updatedOrder : order));
        } catch (error) {
            console.error('Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng:', error);
        }
    };

    const handleStatusFilterChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const filteredOrders = orders.filter(order => 
        statusFilter === '' || order.status === statusFilter
    );

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Orders</Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} onChange={handleStatusFilterChange}>
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="success">Success</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                </Select>
            </FormControl>
            <Grid container spacing={3}>
                {filteredOrders.map(order => (
                    <Grid item xs={12} md={6} key={order._id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Order ID: {order._id}</Typography>
                                <Typography>Customer Name: {order.customerName}</Typography>
                                <Typography>Customer Phone: {order.customerPhone}</Typography>
                                <Typography>Customer Address: {order.customerAddress}</Typography>
                                <Typography>Status: {order.status}</Typography>
                                <Typography>Note: {order.note}</Typography>
                                <Typography>Created At: {new Date(order.createdAt).toLocaleString()}</Typography>
                                <ul>
                                    {order.products.map(product => (
                                        <li key={product._id}>{product.product} (Quantity: {product.quantity})</li>
                                    ))}
                                </ul>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={() => generatePDF(order)}
                                    style={{ marginRight: '10px' }}
                                >
                                    Generate PDF
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    onClick={() => updateOrderStatus(order._id, 'success')}
                                    style={{ marginRight: '10px' }}
                                >
                                    Mark as Success
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    onClick={() => updateOrderStatus(order._id, 'failed')}
                                >
                                    Mark as Failed
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Orders;
