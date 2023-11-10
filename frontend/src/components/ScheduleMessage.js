import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import { DataTable } from 'simple-datatables'; 

const ScheduleMessage = ({}) => {
    const location = useLocation();
    const [scheduleMessage, setScheduleMessage] = useState([]);
    
    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts
        fetchSchedule();
    }, []);

    const fetchSchedule = () => {
        axios.get('http://localhost:5005/schedule')
            .then(response => {
                setScheduleMessage(response.data);
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        // Initialize the datatable here
        if (scheduleMessage.length > 0) {
            const table = new DataTable('.datatable', {
                columns : [
                    { select : 9, sortable : false },
                ]
            });
        }
    }, [scheduleMessage]);

    return (
        <main id="main" className="main">
            <div className="pagetitle">
            <h1>Schedule Message</h1>
            <nav>
                <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li className="breadcrumb-item">Schedule Message</li>
                </ol>
            </nav>
            </div>

            <section className="section">
            <div className="row">
                <div className="col-lg-12">

                <div className="card">
                    <div className="card-body">
                    <h5 className="card-title">Schedule Message</h5>
                    <div className='d-flex justify-content-end'>
                        <button type="button" className="btn btn-primary mb-3" data-toggle="modal" data-target="#exampleModal">Tambah Schedule</button>
                    </div>

                    <table className="table datatable">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Id Message</th>
                            <th scope="col">Jenis Message</th>
                            <th scope="col">Aktivitas</th>
                            <th scope="col">Recipient</th>
                            <th scope="col">Jenis Schedule</th>
                            <th scope="col">Tanggal Mulai</th>
                            <th scope="col">Tanggal Akhir</th>
                            <th scope="col">Waktu</th>
                            <th scope="col">Aksi</th>
                        </tr>
                        </thead>
                        <tbody>
                            {scheduleMessage.map((schedule, index) => (
                                <tr key={schedule.id}>
                                    <td>{index + 1}</td>
                                    <td>{schedule.id_message}</td>
                                    <td>{schedule.jenis_message}</td>
                                    <td>{schedule.id_activity}</td>
                                    <td>Recipient</td>
                                    <td>{schedule.jenis_schedule}</td>
                                    <td>{schedule.tanggal_mulai}</td>
                                    <td>{schedule.tanggal_akhir}</td>
                                    <td>{schedule.waktu}</td>
                                    <td>
                                        <div>
                                            <button type="button" className="btn btn-primary btn-sm" data-toggle="modal" data-target="#exampleModal">Edit</button>
                                            <button type="button" className="btn btn-danger btn-sm">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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

export default ScheduleMessage;
