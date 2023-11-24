import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';

const Dashboard = ({}) => {
    const location = useLocation();
    const [dashboardInfo, setDashboardInfo] = useState({});

    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts

        // Fetch data from the API
        axios.get('http://localhost:5005/dashboard-info')
            .then(response => {
                setDashboardInfo(response.data);
            })
            .catch(error => {
                console.error('Error fetching dashboard info:', error);
            });
    }, []);

    return (
        <main id="main" class="main">
            <div class="pagetitle">
            <h1>Dashboard</h1>
            <nav>
                <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li class="breadcrumb-item active">Dashboard</li>
                </ol>
            </nav>
            </div>

            <section class="section dashboard">
            <div class="row">

                <div class="col-lg-12" style={{marginBottom: '150px'}}>
                <div class="row">
                    <div class="col-xxl-4 col-md-12">
                    <div class="card info-card sales-card">

                        <div class="card-body">
                        <h5 class="card-title">WABS <span>| Whatsapp Broadcast System</span></h5>
                        <p class="mb-0">Selamat datang di Website Whatsapp Broadcast System (WABS)</p>

                        </div>

                    </div>
                    </div>
                </div>
                <div class="row">

                    <div class="col">
                    <div class="card info-card sales-card">

                        <div class="card-body">
                        <h5 class="card-title">Total Recipient</h5>

                        <div class="d-flex align-items-center">
                            <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                            <i class="bi bi-person"></i>
                            </div>
                            <div class="ps-3">
                            <h6>{dashboardInfo.totalRecipients || 0}</h6>
                            
                            </div>
                        </div>
                        </div>

                    </div>
                    </div>

                    <div class="col">
                    <div class="card info-card revenue-card">

                        <div class="card-body">
                        <h5 class="card-title">Total Recipient Group</h5>

                        <div class="d-flex align-items-center">
                            <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                            <i class="bi bi-people"></i>
                            </div>
                            <div class="ps-3">
                            <h6>{dashboardInfo.totalGroups || 0}</h6>
                            </div>
                        </div>
                        </div>

                    </div>
                    </div>

                    <div class="col">
                    <div class="card info-card customers-card">

                        <div class="card-body">
                        <h5 class="card-title">Total Active Schedule</h5>

                        <div class="d-flex align-items-center">
                            <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                            <i class="bi bi-envelope-plus"></i>
                            </div>
                            <div class="ps-3">
                            <h6>{dashboardInfo.totalSchedules || 0}</h6>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>

                </div>
                </div>

            </div>
            </section>

        </main>
    );
};

export default Dashboard;
