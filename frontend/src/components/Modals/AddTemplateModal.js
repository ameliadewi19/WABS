import React, { useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 

const AddTemplateModal = ({ reloadData, reloadDataActivity }) => {
  const [message, setMessage] = useState('');
  const [jenisTemplate, setJenisTemplate] = useState('general'); // Default jenis template
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleJenisTemplateChange = (e) => {
    setJenisTemplate(e.target.value);
  };

  const handleSave = async () => {
    try {
      // Add your logic to save the template to the database using Axios
      // For example:
      await axios.post('http://localhost:5005/template-messages', { jenis_template: jenisTemplate, message });
      
      // Reload the data after saving
      reloadData();
      reloadDataActivity();

      // Close the modal
      setShowModal(false);

      // Close the modal using modalRef
      modalRef.current.click();

      modalRef.current.click();

      // Show SweetAlert on success
      Swal.fire({
        icon: 'success',
        title: 'Template Message Added!',
        showConfirmButton: true,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error saving template:', error);

      Swal.fire({
        icon: 'error',
        title: 'Template Message Not Added!',
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };

  return (
    <div className={`modal fade`} id="addTemplateModal" tabIndex="-1" aria-labelledby="addTemplateModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addTemplateModalLabel">Add Template</h5>
            <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="jenisTemplate" className="form-label">Type</label>
                <select
                  className="form-select"
                  value={jenisTemplate}
                  onChange={handleJenisTemplateChange}
                >
                  <option value="" disabled>Choose templates type</option>
                  <option value="general">General</option>
                  <option value="activity">Activity</option>
                  {/* Add more options based on your jenis template values */}
                </select>

              </div>
              <div className="mb-3">
                <label htmlFor="pembuka" className="form-label">Add Message Template</label>
                <textarea
                  className="form-control"
                  type="text"
                  placeholder="Add message template"
                  style={{ height: '100px' }}
                  value={message}
                  onChange={handleMessageChange}
                ></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTemplateModal;
