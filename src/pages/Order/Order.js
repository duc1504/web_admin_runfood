import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import robotoRegular from '../../fonts/Roboto-Regular'; // Import base64 font
import {
    Container,
    Typography,
    Card,
    CardContent,
    Button,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import '../../styles/styleOrder.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
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

    const generatePDF = (order) => {
        const doc = new jsPDF();

        // Add custom font
        doc.addFileToVFS('Roboto-Regular.ttf', robotoRegular);
        doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
        doc.setFont('Roboto');

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
            startY: 80,
            styles: { font: 'Roboto' }, // Ensure the table uses the custom font
        });

        // Thêm Total Price vào PDF
        doc.text(`Total Price: ${formatCurrency(order.totalPrice)}`, 10, doc.lastAutoTable.finalY + 10);

        doc.save(`order_${order._id}.pdf`);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

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

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredOrders.map(order => ({
            "Order ID": order._id,
            "Customer Name": order.customerName,
            "Customer Phone": order.customerPhone,
            "Customer Address": order.customerAddress,
            "Status": order.status,
            "Note": order.note,
            "Created At": new Date(order.createdAt).toLocaleString(),
            "Total Price": formatCurrency(order.totalPrice)
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

        XLSX.writeFile(workbook, "orders.xlsx");
    };

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
            <div className="export-button-container">
                <Button className='export-btn' variant="contained" color="secondary" onClick={exportToExcel}>
                    Export to Excel
                </Button>
            </div>
            <Grid container spacing={3}>
                {filteredOrders.map(order => (
                    <Grid item xs={12} md={6} key={order._id}>
                        <Card className="order-card">
                            <CardContent>
                                <Typography variant="h6" className="card-details">Order ID: {order._id}</Typography>
                                <Typography className="card-details">Customer Name: {order.customerName}</Typography>
                                <Typography className="card-details">Customer Phone: {order.customerPhone}</Typography>
                                <Typography className="card-details">Customer Address: {order.customerAddress}</Typography>
                                <Typography className="card-details">Total Price: {formatCurrency(order.totalPrice)}</Typography>
                                <Typography className="card-details">Status: {order.status}</Typography>
                                <Typography className="card-details">Note: {order.note}</Typography>
                                <Typography className="card-details">Created At: {new Date(order.createdAt).toLocaleString()}</Typography>
                                <ul>
                                    {order.products.map(product => (
                                        <li key={product._id}>{product.product} (Quantity: {product.quantity})</li>
                                    ))}
                                </ul>
                                <div className="order-buttons">
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => generatePDF(order)}
                                    >
                                        Generate PDF
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        onClick={() => updateOrderStatus(order._id, 'success')}
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
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Orders;
