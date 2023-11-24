import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import feather from 'feather-icons';
import { DataTable } from 'simple-datatables';
import Swal from 'sweetalert2';

const Activity = () => {
  const [activityData, setActivityData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_activity: '',
    activity_name: '',
    activity_date: '',
    activity_description: '',
  });

  const tableOptions = {
    paging: false, // Disable pagination
    // Other DataTable options if needed
  };

  useEffect(() => {
    feather.replace(); // Replace the icons after component mounts
    fetchActivityData();
  }, []);

  useEffect(() => {
    // Initialize the datatable here
    if (activityData.length > 0) {
      const table = new DataTable('.datatable', {
        columns: [
          { select: 4, sortable: false }, // Assuming index 4 is the "Actions" column
        ],
        paging: false,
      });
    }
  }, [activityData]);

  const MySwal = Swal.mixin({
  });

  const formatDate = (dateString) => {
    const dateObject = new Date(dateString);
    const formattedDate = dateObject.toISOString().split('T')[0];
    return formattedDate;
  };

  const fetchActivityData = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/activity`);
      setActivityData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const deleteActivity = async (id) => {
    console.log('ID to be deleted:', id);
    try {
      await axios.delete(`http://localhost:5005/activity/${id}`);
      fetchActivityData();
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDelete = (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this template!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
    if (result.isConfirmed) {
      deleteActivity(id);
    }
    });
  };

  const handleShowModal = () => {
    // Reset the form data when the modal is opened
    setShowModal(true);
    setFormData({
      id_activity: '',
      activity_name: '',
      activity_date: '',
      activity_description: '',
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      id_activity: '',
      activity_name: '',
      activity_date: '',
      activity_description: '',
    });
  };

  const handleEdit = (activity) => {
    setFormData({
      id_activity: activity.id_activity,
      activity_name: activity.activity_name,
      activity_date: formatDate(activity.activity_date),
      activity_description: activity.activity_description,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    console.log('id:', formData.id_activity);
    console.log('activity_name:', formData.activity_name);
    console.log('activity_date:', formData.activity_date);
    console.log('activity_description:', formData.activity_description);

    try {
        if (formData.id_activity) {
            const updatedData = {
                activity_name: formData.activity_name,
                activity_date: formData.activity_date,
                activity_description: formData.activity_description,
            };

            await axios.put(`http://localhost:5005/activity/${formData.id_activity}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Display success message using SweetAlert
            Swal.fire('Success!', 'Activity updated successfully.', 'success');
        } else {
            const postData = {
                activity_name: formData.activity_name,
                activity_date: formData.activity_date,
                activity_description: formData.activity_description,
            };

            await axios.post('http://localhost:5005/activity', postData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Display success message using SweetAlert
            Swal.fire('Success!', 'New activity added successfully.', 'success');
        }

        // Fetch updated data and close the modal
        fetchActivityData();
        handleCloseModal();
    } catch (error) {
        // Display error message using SweetAlert
        fetchActivityData();
        handleCloseModal();
        Swal.fire('Error', 'An error occurred. Please try again later.', 'error');
        console.error('Error:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Handling change for ${name}: ${value}`);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Activity</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
            <li className="breadcrumb-item">Activity</li>
          </ol>
        </nav>
      </div>
      <section className="section">
        <div className="row">
          <div className="card mt-2">
            <div className="card-body">
              <div className='row'>
                <div className='col-md-6'>
                  <h5 className="card-title">Activity</h5>
                  <p>Here is the list of activities.</p>
                </div>
                <div className='col-md-6'>
                  <div className='d-flex justify-content-end'>
                    <button onClick={handleShowModal} className="btn btn-primary mt-3">
                      <i className='bi-plus'></i>Add Activity
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                <table className="table datatable">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Activity Name</th>
                      <th>Activity Date</th>
                      <th>Activity Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityData.map((activity, index) => (
                      <tr key={activity.id_activity}>
                        <td>{index + 1}</td>
                        <td>{activity.activity_name}</td>
                        <td>{formatDate(activity.activity_date)}</td>
                        <td>{activity.activity_description}</td>
                        <td>
                          <button
                            onClick={() => handleEdit(activity)}
                            className="btn btn-primary mt-2 border"
                            style={{ marginRight: '5px' }}
                          >
                            <i className='bi-pencil-fill'></i>
                          </button>
                          <button onClick={() => confirmDelete(activity.id_activity)} className="btn btn-danger mt-2 border">
                            <i className='bi-trash-fill'></i>
                          </button>
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
      {/* Render the modal if showModal is true */}
      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{formData.id_activity ? `Edit Activity` : 'Add Activity'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="id" hidden>
                <Form.Control type="text" name="id" value={formData.id_activity} onChange={handleChange} placeholder='ID' />
              </Form.Group>
              <Form.Group controlId="activity_name" className='mb-3'>
                <Form.Label>Activity Name</Form.Label>
                <Form.Control
                  type="text"
                  name="activity_name"
                  value={formData.activity_name}
                  onChange={handleChange}
                  placeholder='Activity Name'
                  required
                />
              </Form.Group>
              <Form.Group controlId="activity_date" className='mb-3'>
                <Form.Label>Activity Date</Form.Label>
                <Form.Control
                  type="date"
                  name="activity_date"
                  value={formData.activity_date}
                  onChange={handleChange}
                  placeholder='Activity Date'
                  required
                />
              </Form.Group>
              <Form.Group controlId="activity_description" className='mb-3'>
                <Form.Label>Activity Description</Form.Label>
                <Form.Control
                  type="text"
                  name="activity_description"
                  value={formData.activity_description}
                  onChange={handleChange}
                  placeholder='Activity Description'
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            {formData.id_activity ? (
              <button onClick={() => handleSubmit(formData)} className="btn btn-primary">
                Edit
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn btn-primary">
                Add
              </button>
            )}
          </Modal.Footer>
        </Modal>
      )}
    </main>
  );
};

export default Activity;
