import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AddScheduleModal = ({ reloadData }) => {
    const [recipientList, setRecipientList] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState([]);
    const [formData, setFormData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

    return (
        <div className={`modal fade ${showModal ? 'show' : ''}`} id="addScheduleModal" tabIndex="-1" aria-labelledby="addScheduleModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addScheduleModalLabel">Tambah Data Konfirmasi</h5>
                <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <form>
                    <div className="mb-3">
                        <label htmlFor="pembuka" className="form-label">Kalimat Pembuka</label>
                        <textarea
                        className="form-control"
                        id="pembuka"
                        name="pembuka"
                        value={formData.pembuka}
                        onChange={handleInputChange}
                        required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Jadwal</label>
                        <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        />
                    </div>
                    </form>
    
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
                <button type="button" className="btn btn-primary" onClick={handleInputChange}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
    );
}

export default AddScheduleModal;