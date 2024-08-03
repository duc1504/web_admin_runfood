import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import * as XLSX from 'xlsx';
import '../../styles/styleDashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [revenueType, setRevenueType] = useState('daily');
  const chartRef = useRef();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get('https://backend-runfood.vercel.app/revenue/all-products');
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const getOrders = async () => {
      try {
        const response = await axios.get('https://backend-runfood.vercel.app/order/');
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    getProducts();
    getOrders();
  }, []);

  useEffect(() => {
    const getRevenueData = async () => {
      try {
        const response = await axios.get(`https://backend-runfood.vercel.app/revenue/${revenueType}`);
        setRevenueData(response.data.data);
      } catch (error) {
        console.error(`Error fetching ${revenueType} revenue data:`, error);
      }
    };

    getRevenueData();
  }, [revenueType]);

  useEffect(() => {
    if (products.length > 0 && orders.length > 0) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      createChart();
    }
  }, [products, orders]);

  const createChart = () => {
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');

    const productLabels = products.map(product => product.name);
    const productStocks = products.map(product => product.stock);

    const productSales = products.map(product => {
      const sales = orders.reduce((total, order) => {
        const productOrder = order.products.find(p => p.product === product.name);
        return total + (productOrder ? productOrder.quantity : 0);
      }, 0);
      return sales;
    });

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: productLabels,
        datasets: [
          {
            label: 'Stock Quantity',
            data: productStocks,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Sold Quantity',
            data: productSales,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const exportToExcel = () => {
    const formattedData = revenueData.map(data => ({
      ...data,
      totalRevenue: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.totalRevenue)
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue Data");
    XLSX.writeFile(wb, `Revenue_${revenueType}.xlsx`);
  };

  return (
    <div>
      <h1>Product Dashboard</h1>
      <canvas id="myChart" width="400" height="200"></canvas>
      <div className="controls">
      <div>
      <label htmlFor="revenueType">Select Revenue Type: </label>
        <select id="revenueType" value={revenueType} onChange={(e) => setRevenueType(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="product">Product</option>
        </select>
      </div>
        <button className="export-btn" onClick={exportToExcel}>Export to Excel</button>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>{revenueType === 'product' ? 'Product Name' : 'Date'}</th>
            <th>Total Revenue</th>
            <th>Order Count</th>
          </tr>
        </thead>
        <tbody>
          {revenueData.map((data, index) => (
            <tr key={index}>
              <td>{revenueType === 'product' ? data.productName : data._id}</td>
              <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.totalRevenue)}</td>
              <td>{data.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
