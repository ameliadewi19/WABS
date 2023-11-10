import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';

const Dashboard = ({}) => {
    const location = useLocation();
    
    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts
    }, []);

    return (
        <main id="main" class="main">
            <div class="pagetitle">
            <h1>Dashboard</h1>
            <nav>
                <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li class="breadcrumb-item active">Autentikasi Whatsapp</li>
                </ol>
            </nav>
            </div>

            <section class="section dashboard">
            <div class="row">

                <div class="col-lg-12">
                <div class="row">

                    <div class="col-xxl-4 col-xl-12">

                    <div class="card info-card customers-card">
                        <div class="card-body">
                        <h5 class="card-title">Autentikasi <span>| Host</span></h5>

                        <div class="d-flex align-items-center">
                            <p>Autentikasi disini dan barcode</p>
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
