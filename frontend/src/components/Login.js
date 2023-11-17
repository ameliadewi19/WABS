import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';

const Login = ({}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleUsernameChange = (e) => {
      setUsername(e.target.value);
    };
  
    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
    };
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await axios.post('http://localhost:5005/login', {
            username,
            password,
          });
          
          const token = response.data.accessToken;
          
          localStorage.setItem('jwt_token', token);
          //axios.defaults.headers.common['Authorization'] = Bearer ${token};
          console.log('Login berhasil', response.data);
          navigate('/dashboard'); // Use navigate to redirect to the dashboard route
        } catch (err) {
        setError('Login gagal. Username atau password salah.');
        }
    };

    return (
        <main>
            <div class="container">

            <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                    <div class="d-flex justify-content-center py-4">
                        <a href="index.html" class="logo d-flex align-items-center w-auto">
                        <img src="assets/img/logo.png" alt=""/>
                        <span class="d-none d-lg-block">WABS</span>
                        </a>
                    </div>

                    <div class="card mb-3">

                        <div class="card-body">

                        <div class="pt-4 pb-2">
                            <h5 class="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                            <p class="text-center small">Enter your email & password to login</p>
                        </div>

                        <form onSubmit={handleSubmit} class="row g-3 needs-validation" novalidate>

                            <div class="col-12">
                                <label for="yourUsername" class="form-label">Username</label>
                                    <div class="input-group has-validation">
                                        {/* <span class="input-group-text" id="inputGroupPrepend">@</span> */}
                                        <input className="form-control form-control-lg" 
                                            type="text"
                                            placeholder="Masukkan username Anda"
                                            value={username}
                                            onChange={handleUsernameChange}/>
                                        <div class="invalid-feedback">Please enter your username.</div>
                                    </div>
                            </div>

                            <div class="col-12">
                                <label for="yourPassword" class="form-label">Password</label>
                                <input className="form-control form-control-lg"
                                    type="password"
                                    placeholder="Masukkan password Anda"
                                    value={password}
                                    onChange={handlePasswordChange}/>
                            <div class="invalid-feedback">Please enter your password!</div>
                            </div>

                            {/* <div class="col-12">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" name="remember" value="true" id="rememberMe"/>
                                <label class="form-check-label" for="rememberMe">Remember me</label>
                            </div>
                            </div> */}
                            
                            <div class="col-12">
                            <button class="btn btn-primary w-100" type="submit">Login</button>
                            </div>
                            <div class="col-12">
                            {/* <p class="small mb-0">Don't have account? <a href="pages-register.html">Create an account</a></p> */}
                            </div>
                        </form>

                        </div>
                    </div>

                    <div class="credits">
                        
                    </div>

                    </div>
                </div>
                </div>

            </section>

            </div>
        </main>
    );
};

export default Login;