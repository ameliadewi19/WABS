import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTemplateModal = ({ template, handleClose, reloadData, reloadDataActivity }) => {
  const [message, setMessage] = useState('');
  const [jenisTemplate, setJenisTemplate] = useState('general');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Set the initial values when the template prop changes
    if (template) {
      setMessage(template.message);
      setJenisTemplate(template.jenis_template);
      setShowModal(true);
    }
  }, [template]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleJenisTemplateChange = (e) => {
    setJenisTemplate(e.target.value);
  };

  const handleSave = async () => {
    try {
      // Add your logic to save the edited template to the database using Axios
      // For example:
      await axios.put(`http://localhost:5005/template-messages/${template.id}`, {
        jenis_template: jenisTemplate,
        message: message,
      });

      // Reload the data after saving
      reloadData();
      reloadDataActivity();

      // Close the modal
      setShowModal(false);
      var elementsToRemove = document.querySelectorAll('.modal-backdrop');
        elementsToRemove.forEach(function (element) {
        element.parentNode.removeChild(element);
      });
      
    } catch (error) {
      console.error('Error saving edited template:', error);
    }
  };

  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} id="editTemplateModal" tabIndex="-1" aria-labelledby="editTemplateModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editTemplateModalLabel">Edit Template Message</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setShowModal(false)}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="jenisTemplate" className="form-label">Jenis Template</label>
                <select
                  className="form-select"
                  value={jenisTemplate}
                  onChange={handleJenisTemplateChange}
                >
                  <option value="" disabled>Pilih jenis template</option>
                  <option value="general">General</option>
                  <option value="activity">Activity</option>
                  {/* Add more options based on your jenis template values */}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="pembuka" className="form-label">Masukkan Pesan Template</label>
                <textarea
                  className="form-control"
                  type="text"
                  placeholder="Masukkan template pesan"
                  style={{ height: '100px' }}
                  value={message}
                  onChange={handleMessageChange}
                ></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Simpan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTemplateModal;
