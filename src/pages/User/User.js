import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../styles/styleUser.css";
import * as XLSX from 'xlsx';
const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://backend-runfood.vercel.app/user');
        if (response.data.status) {
          setUsers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users, {
      header: ["name", "email", "phone", "role"]
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
  };
  return (
    <div>
      <h1>User List</h1>\
      <button onClick={exportToExcel} style={{ marginBottom: '10px', float: 'right' }}>Export to Excel</button>
      <table id="userTable" className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </div>
  );
};

export default User;
