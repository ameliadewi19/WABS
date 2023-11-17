import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import './createRecipient.css';
import feather from 'feather-icons';
import { DataTable } from 'simple-datatables'; 

const Recipient = ({}) => {
    const [recipientData, setRecipientData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
            nama: '',
            no_whatsapp: '',
    });
    const location = useLocation();
    

    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts

        fetchRecipientData();
    }, []);

    useEffect(() => {
      // Initialize the datatable here
      if (recipientData.length > 0) {
          const table = new DataTable('.datatable', {
              columns : [
                  { select : 3, sortable : false },
              ]
          });
      }
  }, [recipientData]);

    const fetchRecipientData = async () => {
        try {
          const response = await axios.get('/recipient');
          setRecipientData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
    };
    
        // const fetchRecipientData = async (username, password) => {
    //     try {
    //         // Mendapatkan token dari credential login
    //         const credentials = { username, password };  // Assuming you have a method to fetch credentials based on the username and password
    //         const token = await getAccessToken(credentials);
    
    //         // Menambahkan token ke header Authorization
    //         const headers = {
    //             Authorization: `Bearer ${token}`,
    //         };
    
    //         // Melakukan panggilan API dengan menyertakan header
    //         const response = await axios.get('http://localhost:5005/recipient', { headers });
    
    //         // Menggunakan data yang diterima
    //         setRecipientData(response.data);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };
    
    // const getAccessToken = async (credentials) => {
    //     try {
    //         // Perform the logic to obtain the access token based on the provided credentials
    //         // This could involve making a request to your authentication server or fetching it from a database
    //         // For example:
    //         const authenticationResponse = await axios.post('http://localhost:5005/authenticate', credentials);
    //         const token = authenticationResponse.data.accessToken;
    //         return token;
    //     } catch (error) {
    //         console.error('Error obtaining access token:', error);
    //         throw error; // You may want to handle this error more gracefully in your application
    //     }
    // };

    const deleteRecipient = async (id) => {
        console.log('ID yang akan dihapus:', id);
        try {
          await axios.delete(`http://localhost:5005/recipient/${id}`);
          fetchRecipientData();
        } catch (error) {
          console.log(error);
        }
    };

    const confirmDelete = (id) => {
        const shouldDelete = window.confirm('Apakah Anda yakin ingin menghapus data ini?');
        if (shouldDelete) {
          deleteRecipient(id);
        }
    };

    const handleShowModal = () => {
        setShowModal(true);
      };
    
    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
          nama: '',
          no_whatsapp: '',
        });
    };  

    const handleEdit = (recipient) => {
        setFormData({
          id: recipient.id,
          nama: recipient.nama,
          no_whatsapp: recipient.no_whatsapp,
        });
        setShowModal(true);
      };

      const handleSubmit = async () => {
        if (formData.id) {
          try {
            await axios.put(`http://localhost:5005/recipient/${formData.id}`, formData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            fetchRecipientData();
            handleCloseModal();
          } catch (error) {
            console.error('Error updating data:', error);
          }
        } else {
          try {
            await axios.post('http://localhost:5005/recipient1', formData, {
              headers: {
                'Content-Type': 'application/json',
              },
            });
            fetchRecipientData();
            handleCloseModal();
          } catch (error) {
            console.error('Error saving data:', error);
          }
        }
      };
    
      const handleEditSave = async (recipient) => {
        const { id, ...formDataWithoutId } = recipient; // Separate id from formData
    
        try {
            await axios.patch(`http://localhost:5005/recipient/${id}`, formDataWithoutId, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            // Find the index of the edited recipient in the array
            const index = recipientData.findIndex((r) => r.id === id);
    
            // Create a new array with the updated recipient at the same position
            const updatedRecipientData = [...recipientData];
            updatedRecipientData[index] = recipient;
    
            // Update the state with the new array
            setRecipientData(updatedRecipientData);
    
            handleCloseModal();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };
    


      const handleFileUpload = async (e) => {
        const fileInput = e.target; // Get a reference to the file input element
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('excelFile', file);
      
        // Show a confirmation dialog before proceeding with the upload
        const confirmUpload = window.confirm("Are you sure you want to upload this Excel file?");
        
        if (confirmUpload) {
            try {
                const response = await axios.post('http://localhost:5005/recipient', formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
                console.log(response.data);
                fetchRecipientData(); // Fetch the updated data
                // Clear the file input field after successful upload
                fileInput.value = ''; // Reset the file input value to an empty string
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        } else {
          // User canceled the upload, you can handle it as needed
          console.log("Upload canceled.");
        }
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
      
        // Validasi Nama: Hanya huruf diizinkan
        if (name === "nama" && /[^a-zA-Z\s]/.test(value)) {
          alert("Nama hanya boleh mengandung huruf.");
          return;
        }

        // Validasi NO WHATSAPP: Hanya angka diizinkan
        // if (name === "no_whatsapp" && !/^\+\d{11,15}$/.test(value)) {
        //   alert("Masukkan nomor telepon dengan format yang benar, contoh: +6280102108290");
        //   return;
        // }
      
        setFormData({
          ...formData,
          [name]: value,
        });
      };

    return (
        <main id="main" className="main">
            
            <div className="pagetitle">
            <h1>Recipient</h1>
            <nav>
                <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li className="breadcrumb-item active">Recipient</li>
                </ol>
            </nav>
            </div>
              
            <section className="section">
            <div className="row">
                <div className="card mt-5">
                    <div className="card-body">
                    <div className="row">
                        <div className="col-lg-6">
                          <h5 className="card-title">Recipient</h5>
                          <p>Berikut ini merupakan list recipient yang bisa menerima pesan broadcast</p>
                        </div>
                        <div className="col-lg-6">
                        <div className="upload-section">
                          <button className="btn btn-primary" onClick={handleShowModal}><i className='bi bi-plus'></i>
                            Tambah Dosen
                          </button>
                          <label htmlFor="fileInput" className="btn btn-secondary upload-button">
                            <span dangerouslySetInnerHTML={{ __html: feather.icons.upload.toSvg() }} className="mr-2" />
                          </label>
                          <input type="file" id="fileInput" accept=".xlsx" onChange={handleFileUpload} />
                          <a className="btn btn-primary download-template" href="/template/excel-template.xlsx" download>
                            <i className="icon" data-feather="download"></i>
                          </a>
                        </div>
                        </div>

                    </div>
                    <table className="table datatable">
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>No Whatsapp</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                    {recipientData.map((recipient, index) => (
                      <tr key={recipient.id}>
                        <td>{index + 1}</td>
                        <td>{recipient.nama}</td>
                        <td>{recipient.no_whatsapp}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleEdit(recipient)}
                            style={{ marginRight: '5px' }}
                          >
                          <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button type="button" className="btn btn-danger" onClick={() => confirmDelete(recipient.id)}>
                          <i className="bi bi-trash-fill"></i>
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
            <Modal.Title>{formData.id? `Edit Recipient` : 'Tambah Recipient'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="id" hidden>
                <Form.Control type="text" name="id" value={formData.id} onChange={handleChange} placeholder='ID' />
              </Form.Group>
              <Form.Group controlId="nama">
                <Form.Label>Nama</Form.Label>
                <Form.Control type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder='Nama Recipient'/>
              </Form.Group>
              <Form.Group controlId="no_whatsapp">
                <Form.Label>No Whatsapp</Form.Label>
                <Form.Control
                  type="text"
                  name="no_whatsapp"
                  value={formData.no_whatsapp}
                  onChange={handleChange}
                  placeholder='Nomor Whatsapp, Contoh: +6289389982923'
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            {formData.id ? (
              <button onClick={() => handleEditSave(formData)} className="btn btn-primary">
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

export default Recipient;
