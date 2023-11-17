import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import feather from 'feather-icons';
import { DataTable } from 'simple-datatables';

const Activity = ({}) => {
  const [activityData, setActivityData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    activity_name: '',
    activity_date: '',
    activity_description: '',
  });
  const [entriesPerPage, setEntriesPerPage] = useState(10); // Default entries per page

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
      });
    }
  }, [activityData]);

  const fetchActivityData = async () => {
    try {
      const response = await axios.get(`http://localhost:5005/activity?limit=${entriesPerPage}`);
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
    const shouldDelete = window.confirm('Are you sure you want to delete this data?');
    if (shouldDelete) {
      deleteActivity(id);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      id: '',
      activity_name: '',
      activity_date: '',
      activity_description: '',
    });
  };

  const handleEdit = (activity) => {
    setFormData({
      id: activity.id,
      activity_name: activity.activity_name,
      activity_date: activity.activity_date,
      activity_description: activity.activity_description,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (formData.id) {
      try {
        await axios.put(`http://localhost:5005/activity/${formData.id}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        fetchActivityData();
        handleCloseModal();
      } catch (error) {
        console.error('Error updating data:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:5005/activity', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        fetchActivityData();
        handleCloseModal();
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleEntriesPerPageChange = (e) => {
    const selectedEntriesPerPage = parseInt(e.target.value, 10);
    setEntriesPerPage(selectedEntriesPerPage);
    fetchActivityData();
  };

  const handleTambahAktivitasClick = () => {
    console.log('Tambah Aktivitas clicked!');
  };

  return (
    <main id="main" className="main">
      {/* ... Other code ... */}
      <section className="section">
        <div className="row">
          <div className="card mt-5">
            <div className="card-body">
              <h5 className="card-title">Activity</h5>
              <p>Here is the list of activities.</p>

              <div className="d-flex mb-3">
                <div className="mr-2">
                  <label>Show entries:</label>
                  <select value={entriesPerPage} onChange={handleEntriesPerPageChange}>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
              <div className='row'>
                    <div className='col-md-4'>
                    <button onClick={handleTambahAktivitasClick} className="btn btn-primary">
                        Tambah Aktivitas
                    </button>
                    </div>
                </div>
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
                    <tr key={activity.id}>
                      <td>{index + 1}</td>
                      <td>{activity.activity_name}</td>
                      <td>{activity.activity_date}</td>
                      <td>{activity.activity_description}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(activity)}
                          className="btn btn-primary mt-2 border"
                          style={{ marginRight: '5px' }}
                        >
                          Edit
                        </button>
                        <button onClick={() => confirmDelete(activity.id)} className="btn btn-danger mt-2 border">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      {/* Render the modal if showModal is true */}
      {showModal && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{formData.id ? `Edit Activity` : 'Add Activity'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {/* ... Other form groups ... */}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            {formData.id ? (
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