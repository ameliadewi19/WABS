import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'simple-datatables';

const RecipientListModal = ({ reloadData, selectedScheduleId }) => {
    const [recipientData, setRecipientData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef();

    const fetchRecipientList = async () => {
        try {
            const response = await axios.get(`http://localhost:5005/schedule/${selectedScheduleId}`);
            const recipients = response.data.recipient_list.map(recipient => recipient.recipients);
            setRecipientData(recipients);
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
    }, []);

    return (
        <div className={`modal fade`} id="recipientListModal" tabIndex="-1" aria-labelledby="recipientListModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="recipientListModalLabel">List Recipient</h5>
                <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
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