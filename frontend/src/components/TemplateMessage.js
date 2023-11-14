import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import { DataTable } from 'simple-datatables'; 

const TemplateMessage = ({}) => {
    const location = useLocation();
    
    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts
        // Initialize the datatable here
        const table = new DataTable('.datatable');
    }, []);

    return (
        <main id="main" className="main">
            <div className="pagetitle">
            <h1>Template Message</h1>
            <nav>
                <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li className="breadcrumb-item active">Template Message</li>
                </ol>
            </nav>
            </div>

            <section className="section">
            <div className="row">
                <div className="col-lg-12">

                <div className="card">
                    <div className="card-body">
                    <h5 className="card-title">General Templates</h5>
                    <p>Template yang bisa digunakan untuk mengirim pesan broadcast</p>

                    <table className="table datatable">
                        <thead>
                        <tr>
                            <th scope="col">No</th>
                            <th scope="col">Message</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Brandon Jacob</td>
                        </tr>
                        </tbody>
                    </table>

                    </div>
                </div>

                </div>
            </div>
            </section>

        </main>

    );
};

export default TemplateMessage;
