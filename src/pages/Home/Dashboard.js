import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const chartRef = useRef();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get('https://backend-runfood.vercel.app/product/');
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

    // Tính tổng số lượng sản phẩm đã bán dựa trên đơn hàng
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

  return (
    <div>
      <h1>Product Dashboard</h1>
      <canvas id="myChart" width="400" height="200"></canvas>
    </div>
  );
};

export default Dashboard;
