import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'simple-datatables';

const RecipientListModal = ({ reloadData, selectedScheduleId }) => {
    const [recipientData, setRecipientData] = useState([]);
    const [template, setTemplate] = useState('');
    const [activity, setActivity] = useState(''); 
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef();

    const fetchRecipientList = async () => {
      setTemplate('');
      setActivity('');
        try {
            const response = await axios.get(`http://localhost:5005/schedule/${selectedScheduleId}`);
            const recipients = response.data.recipient_list.map(recipient => recipient.recipients);
            setRecipientData(recipients);

            axios.get(`http://localhost:5005/template-messages/${response.data.id_message}`)
            .then((response) => {
                setTemplate(response.data.message);
            })

            if(response.data.id_activity) {
                axios.get(`http://localhost:5005/activity/${response.data.id_activity}`)
                .then((response) => {
                    setActivity(response.data);
                })
            }
        } catch (error) {
            console.error('Error fetching recipient list:', error);
        }
    }

    useEffect(() => {
        if(selectedScheduleId) {
            fetchRecipientList();
        }
    }, [selectedScheduleId]);

    useEffect(() => {
      // Initialize the datatable here
      if (recipientData.length > 0) {
          const tableRecipient = new DataTable('.datatable-recipient-list', {
            info: true,
            destroy: true
          });
      }

    }, [recipientData]);

    useEffect(() => {
        // Check if the modal is being closed
        const handleModalClose = () => {
            // Reset or reload data when the modal is closed
            setRecipientData([]); // You can reset the state to an empty array or trigger a data reload function
            reloadData();
            setTemplate('');
            setActivity('');
        };

        // Add an event listener to the modal reference for the 'hidden.bs.modal' event
        if (modalRef.current) {
            modalRef.current.addEventListener('hidden.bs.modal', handleModalClose);
        }

        // Clean up the event listener when the component is unmounted
        return () => {
            if (modalRef.current) {
                modalRef.current.removeEventListener('hidden.bs.modal', handleModalClose);
            }
        };
    }, [recipientData, reloadData, template, activity]);

    function formatDate(dateString) {
      const dateObject = new Date(dateString);
      const day = dateObject.getDate().toString().padStart(2, '0'); // Tambahkan leading zero jika diperlukan
      const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Tambah 1 karena bulan dimulai dari 0
      const year = dateObject.getFullYear();
      return `${day}-${month}-${year}`;
  }

    return (
        <div className={`modal fade`} id="recipientListModal" tabIndex="-1" aria-labelledby="recipientListModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="recipientListModalLabel">Detail</h5>
                <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <div className='mb-3'>
                  <label htmlFor="template" className="form-label">Message Template</label>
                  <textarea
                    className="form-control"
                    type="text"
                    placeholder="Message Template"
                    value={template}
                    rows={3}
                    disabled
                  ></textarea>
                </div>
                {activity && (
                  <div className='mb-3'>
                    <label htmlFor="activity" className="form-label">Activity</label>
                    <div className='row'>
                      <div className='col-md-4'>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Activity"
                          value={activity.activity_name}
                          disabled
                        />
                      </div>
                      <div className='col-md-4'>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="Activity"
                          value={formatDate(activity.activity_date)}
                          disabled
                        />
                      </div>
                      <div className='col-md-4'>
                        <textarea
                          className="form-control"
                          type="text"
                          placeholder="Activity"
                          value={activity.activity_description}
                          rows={1}
                          disabled
                        ></textarea>
                      </div>
                    </div>
                  </div>
                
                )}
                  <label htmlFor="recipientList" className="form-label">Recipient List</label>
                    <table className="table datatable-recipient-list table-striped">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Nama</th>
                          <th>No Whatsapp</th>
                        </tr>
                      </thead>
                      <tbody>
                      {recipientData.map((recipient, index) => (
                        <tr key={recipient.id}>
                          <td>{index + 1}</td>
                          <td>{recipient.nama}</td>
                          <td>{recipient.no_whatsapp}</td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
    );
}

export default RecipientListModal;