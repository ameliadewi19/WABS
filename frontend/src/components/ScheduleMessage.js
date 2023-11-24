import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { DataTable } from 'simple-datatables'; 
import Swal from 'sweetalert2';
import AddScheduleModal from './Modals/AddScheduleModal';
import EditScheduleModal from './Modals/EditScheduleModal';
import RecipientListModal from './Modals/RecipientListDetailModal';

const ScheduleMessage = ({}) => {
    const location = useLocation();
    const [scheduleMessage, setScheduleMessage] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    
    const fetchSchedule = () => {
        axios.get('http://localhost:5005/schedule')
            .then(async (response) => {
                console.log(response.data);
                // Loop through each schedule to fetch activity name
                const scheduleWithActivityNames = await Promise.all(response.data.map(async (schedule) => {
                    // Check if id_activity is not null before fetching activity details
                    if (schedule.id_activity !== null) {
                        // Fetch activity details using id_activity
                        const activityDetails = await fetchActivityById(schedule.id_activity);
                        // Add activity name to the schedule object using object destructuring
                        return { ...schedule, activity_name: activityDetails.activity_name };
                    } else {
                        // If id_activity is null, return the original schedule without adding activityName
                        return schedule;
                    }
                }));
    
                // Now scheduleWithActivityNames contains the original schedules with added activity names
                setScheduleMessage(scheduleWithActivityNames);
            })
            .catch((error) => {
                console.error('Error fetching schedule message:', error);
            });
    }
    
    const fetchActivityById = async (activityId) => {
        try {
            const activityResponse = await axios.get(`http://localhost:5005/activity/${activityId}`);
            return activityResponse.data;
        } catch (error) {
            console.error('Error fetching activity by ID:', error);
            throw error;
        }
    }

    useEffect(() => {
        fetchSchedule();
    }, []);

    useEffect(() => {
        // Initialize the datatable here
        if (scheduleMessage.length > 0) {
            const table = new DataTable('.datatable', {
                data: scheduleMessage,
                info: true,
                columns : [
                    { select : 7, sortable : false },
                    { select : 6, sortable : false }
                ],
                responsive: true,
            });
        };
    }, [scheduleMessage]);

    function formatDate(dateString) {
        const dateObject = new Date(dateString);
        const day = dateObject.getDate().toString().padStart(2, '0'); // Tambahkan leading zero jika diperlukan
        const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Tambah 1 karena bulan dimulai dari 0
        const year = dateObject.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const handleEdit = (id) => {
        setSelectedId(id);
        console.log("selected id edit: ", id);
    }

    const handleDetailrecipient = (id) => {
        setSelectedId(id);
        console.log("selected id detail: ", id);
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: "Anda tidak akan dapat mengembalikan ini!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:5005/schedule/${id}`)
                    .then((response) => {
                        console.log(response);
                        Swal.fire({
                            icon: 'success',
                            title: 'Berhasil menghapus schedule',
                            showConfirmButton: false,
                            timer: 1500,
                        }).then(() => {
                            fetchSchedule();
                        });
                    })
                    .catch((error) => {
                        console.error('Error deleting schedule:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Gagal menghapus schedule',
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    });
            }
          });
    }

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
                        <div className='row'>
                            <div className='col-md-6'>
                                <h5 className="card-title">Schedule Message</h5>    
                            </div>
                            <div className='col-md-6'>
                                <div className='d-flex justify-content-end'>
                                    <button type="button" className="btn btn-primary mb-3 mt-3 me-2" data-bs-toggle="modal" data-bs-target="#addScheduleModal"><i className='bi-plus'></i>Tambah Schedule</button>
                                    <AddScheduleModal reloadData={fetchSchedule} />
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive">
                            <table className="table datatable">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Jenis Message</th>
                                    <th scope="col">Aktivitas</th>
                                    <th scope="col">Jenis Schedule</th>
                                    <th scope="col">Rentang Tanggal</th>
                                    <th scope="col">Waktu</th>
                                    <th scope="col">Recipient</th>
                                    <th scope="col">Aksi</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {scheduleMessage.map((schedule, index) => (
                                        <tr key={schedule.id}>
                                            <td>{index + 1}</td>
                                            <td><p className='text-capitalize'>{schedule.jenis_message}</p></td>
                                            <td>{schedule.activity_name || '-'}</td>
                                            <td><p className='text-capitalize'>{schedule.jenis_schedule}</p></td>
                                            <td>{formatDate(schedule.tanggal_mulai) + ' - ' + formatDate(schedule.tanggal_akhir)}</td>
                                            <td>{schedule.waktu}</td>
                                            <td>
                                                <button type="button" className="btn btn-success btn-sm ms-1" onClick={()=>handleDetailrecipient(schedule.id)} data-bs-toggle="modal" data-bs-target="#recipientListModal"><i className='bi-people-fill'></i></button>
                                                <RecipientListModal reloadData={fetchSchedule} selectedScheduleId={selectedId}/>
                                            </td>
                                            <td>
                                                <div className='d-flex flex-column flex-sm-row'>
                                                    <button type="button" className="btn btn-primary btn-sm" onClick={()=>handleEdit(schedule.id)} data-bs-toggle="modal" data-bs-target="#editScheduleModal"><i className='bi-pencil-fill'></i></button>
                                                    <button type="button" className="btn btn-danger btn-sm ms-1" onClick={()=>handleDelete(schedule.id)}><i className='bi-trash-fill'></i></button>
                                                </div>
                                                <EditScheduleModal reloadData={fetchSchedule} selectedScheduleId={selectedId}/>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                </div>
            </div>
            </section>

        </main>

    );
};

export default ScheduleMessage;
