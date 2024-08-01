import React, { useState } from 'react';
import '../styles/styleLogin.css';
import Swal from 'sweetalert2'
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    // console.log(email, password);
    try {
      const response = await fetch('https://backend-runfood.vercel.app/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password:password
        })
      });


      const data = await response.json();
      if (data.status) {
        console.log(data.data);
        if (data.data.role == 'admin') {
            // lưu dữ liệu với localStorage
          localStorage.setItem('user', JSON.stringify(data.data));
           window.location.href = '/';
        }else{
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You do not have access to the system!",
           
          });
         
        }
             
      } else {
        console.log('thất bại');
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Login failed!",
         
        });
      }
 
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='body'>
    <div className="loginBox">
      <img className="user" src="https://i.ibb.co/yVGxFPR/2.png" height="100px" width="100px" alt="user icon" />
      <h3>Sign in here</h3>
      <form onSubmit={handleLogin}>
        <div className="inputBox">
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <input type="button" value="Login" onClick={handleLogin}/>
      </form>
    </div>
    </div>
  );
}

export default Login;
