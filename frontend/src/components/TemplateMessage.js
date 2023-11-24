import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import { DataTable } from 'simple-datatables'; 
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AddTemplateModal from './Modals/AddTemplateModal';
import EditTemplateModal from './Modals/EditTemplateModal';

const TemplateMessage = ({}) => {
    const location = useLocation();
    const [templateMessages, setTemplateMessages] = useState([]);
    const [templateActivityMessages, setTemplateActivityMessages] = useState([]);
    const MySwal = withReactContent(Swal);
    const [selectedTemplate, setSelectedTemplate] = useState(null);


    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts
        fetchData();
        fetchDataActivity();
    }, []);

    const tableOptions = {
        paging: false, // Disable pagination
        // Other DataTable options if needed
    };

    useEffect(() => {
        // Initialize the datatable here
        if (templateMessages.length > 0) {
            const table = new DataTable('.datatable', tableOptions);
        }
    }, [templateMessages]);

    useEffect(() => {
        // Initialize the datatable here
        if (templateActivityMessages.length > 0) {
            const table2 = new DataTable('.datatable-activity', tableOptions);
        }
    }, [templateActivityMessages]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5005/template-messages/jenis/general');
            setTemplateMessages(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchDataActivity = async () => {
        try {
            const response = await axios.get('http://localhost:5005/template-messages/jenis/activity');
            setTemplateActivityMessages(response.data); // Fixed the state assignment
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleDelete = (id) => {
        MySwal.fire({
          title: 'Are you sure?',
          text: 'You will not be able to recover this template!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
        }).then((result) => {
          if (result.isConfirmed) {
            // User clicked Yes, proceed with deletion
            deleteTemplate(id);
          }
        });
    };
    
    const deleteTemplate = async (id) => {
        try {
          // Call your delete API endpoint
          await axios.delete(`http://localhost:5005/template-messages/${id}`);
    
          // Reload the data after deleting
          fetchData();
          fetchDataActivity();
    
          MySwal.fire('Deleted!', 'Your template has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting template:', error);
          MySwal.fire('Error!', 'An error occurred while deleting the template.', 'error');
        }
    };

    const handleEdit = (template) => {
        setSelectedTemplate(template);
        // Open the edit modal here if you are using a modal library
        // You can trigger the modal opening logic from here
    };

    return (
        <main id="main" className="main">
            <div className="pagetitle">
            <div className='row'>
                <div className='col-md-6'>
                <h1>Template Message</h1>
                <nav>
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                    <li className="breadcrumb-item active">Template Message</li>
                    </ol>
                </nav>
                </div>
                <div className='col-md-6'>
                    <div className='d-flex justify-content-end'>
                        <button type="button" className="btn btn-primary me-2" data-bs-toggle="modal" data-bs-target="#addTemplateModal"><i className='bi bi-plus'></i>Tambah Template</button>
                        <AddTemplateModal reloadData={fetchData} reloadDataActivity={fetchDataActivity} />
                    </div>
                </div>
            </div>
            </div>

            <section className="section">
            <div className="row">
                <div className="col-lg-12">

                <div className="card">
                    <div className="card-body">
                    <h5 className="card-title">General Templates</h5>
                    <p>Template yang bisa digunakan untuk mengirim pesan broadcast</p>

                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <table className="table datatable">
                            <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Message</th>
                                <th scope="col">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {templateMessages.map((template, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{template.message}</td>
                                <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => handleEdit(template)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#editTemplateModal"
                                    >
                                        <i className="bi bi-pencil-fill"></i>
                                    </button>
                                    <EditTemplateModal
                                    template={selectedTemplate}
                                    handleClose={() => setSelectedTemplate(null)}
                                    reloadData={fetchData}
                                    reloadDataActivity={fetchDataActivity}
                                    />
                                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(template.id)}>
                                        <i className="bi bi-trash-fill"></i>
                                    </button>
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
            </div>
            </section>

            <section className="section">
            <div className="row">
                <div className="col-lg-12">

                <div className="card">
                    <div className="card-body">

                    <h5 className="card-title">Activity Templates</h5>
                    <p>Template yang bisa digunakan untuk kegiatan tertentu</p>
                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <table className="table2 datatable-activity">
                            <thead>
                            <tr>
                                <th scope="col">No</th>
                                <th scope="col">Message</th>
                                <th scope="col">Aksi</th>
                            </tr>
                            </thead>
                            <tbody>
                            {templateActivityMessages.map((templateActivity, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{templateActivity.message}</td>
                                <td>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => handleEdit(templateActivity)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#editTemplateModal"
                                    >
                                        <i className="bi bi-pencil-fill"></i>
                                    </button>
                                    <EditTemplateModal
                                    template={selectedTemplate}
                                    handleClose={() => setSelectedTemplate(null)}
                                    reloadData={fetchData}
                                    reloadDataActivity={fetchDataActivity}
                                    />
                                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(templateActivity.id)}>
                                        <i className="bi bi-trash-fill"></i>
                                    </button>
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
            </div>
            </section>

        </main>
    );
};

export default TemplateMessage;