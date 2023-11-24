import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddGroupModal = ({ reloadData }) => {
  const [nama_grup, setNamaGroup] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [recipients, setRecipients] = useState([{ id_recipient: null }]);
  const [recipientOptions, setRecipientOptions] = useState([]); // New state for recipient options
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    // Fetch recipient data from the API
    const fetchRecipientOptions = async () => {
      try {
        const response = await axios.get('http://localhost:5005/recipient');
        setRecipientOptions(response.data);
      } catch (error) {
        console.error('Error fetching recipient data:', error);
      }
    };

    fetchRecipientOptions();
  }, []); // Empty dependency array to fetch data only once on component mount

  const handleGroupChange = (e) => {
    setNamaGroup(e.target.value);
  };

  const handleDeskripsiChange = (e) => {
    setDeskripsi(e.target.value);
  };

  const handleRecipientChange = (e, index) => {
    const { name, value } = e.target;
    const newRecipients = [...recipients];
    newRecipients[index][name] = value === "" ? null : value;
    setRecipients(newRecipients);
  };  
  
  const addRecipient = () => {
    setRecipients([...recipients, { id_recipient: null }]);
  };  
  
  const removeRecipient = (index) => {
    const newRecipients = [...recipients];
    newRecipients.splice(index, 1);
    setRecipients(newRecipients);
  };
  
  const handleSave = async () => {
    try {
      // Filter out recipients without id_recipient
      const filteredRecipients = recipients
        .filter((recipient) => recipient.id_recipient != null)
        .map((recipient) => ({ id_recipient: recipient.id_recipient }));
  
      console.log(filteredRecipients);
  
      // Add your logic to save the group to the database using Axios
      await axios.post('http://localhost:5005/groups', {
        nama_grup,
        deskripsi,
        recipients: filteredRecipients,
      });
  
      // Reload the data after saving
      reloadData();
  
      // Close the modal using modalRef
      modalRef.current.click();

      Swal.fire({
        icon: 'success',
        title: 'Group Recipient Message Added!',
        showConfirmButton: true,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error saving group:', error);
      Swal.fire({
        icon: 'success',
        title: 'Group Recipient Message Not Added!',
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };  

  return (
    <div className={`modal fade`} id="addGroupModal" tabIndex="-1" aria-labelledby="addGroupModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addGroupModalLabel">Tambah Group Recipient</h5>
            <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="namagroup" className="form-label">Nama Grup</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Masukkan nama grup"
                  value={nama_grup}
                  onChange={handleGroupChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="pembuka" className="form-label">Deskripsi</label>
                <textarea
                  className="form-control"
                  type="text"
                  placeholder="Masukkan deskripsi grup"
                  style={{ height: '100px' }}
                  value={deskripsi}
                  onChange={handleDeskripsiChange}
                ></textarea>
              </div>
              {recipients.map((recipient, index) => (
                <div key={index} className="mb-3">
                  <label htmlFor={`recipient-${index}`} className="form-label">Recipient {index + 1}</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      name="id_recipient"
                      value={recipient.id_recipient}
                      onChange={(e) => handleRecipientChange(e, index)}
                      required
                    >
                      <option value="" disabled selected>
                        Pilih kontak
                      </option>
                      {recipientOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.nama} ({option.no_whatsapp})
                        </option>
                      ))}
                    </select>
                    <button type="button" className="btn btn-danger" onClick={() => removeRecipient(index)}>
                      <i className='bi bi-trash'></i>
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-primary" onClick={addRecipient}>
                <i className='bi bi-plus'></i> Add Recipient
              </button>
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

export default AddGroupModal;
