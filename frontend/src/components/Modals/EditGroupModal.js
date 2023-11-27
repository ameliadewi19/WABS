import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditGroupModal = ({ reloadData, groupId }) => {
  const [groupData, setGroupData] = useState({
    nama_grup: '',
    deskripsi: '',
    recipients: [],
  });
  const [recipientOptions, setRecipientOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    console.log("Inside useEffect - showModal:", showModal, "groupId:", groupId);
    const fetchRecipientOptions = async () => {
      try {
        const response = await axios.get('http://localhost:5005/recipient');
        setRecipientOptions(response.data);
        console.log("Recipient options:", response.data);
      } catch (error) {
        console.error('Error fetching recipient data:', error);
      }
    };
  
    fetchRecipientOptions();
  
    // Load existing group details when the modal is shown
    if (groupId) {
      console.log("Loading group details...");
      loadGroupDetails(groupId);
    }
  }, [showModal, groupId]);  

  const loadGroupDetails = async (groupId) => {
    try {
      const response = await axios.get(`http://localhost:5005/groups/${groupId}`);
      setGroupData(response.data);
      console.log("Response data:", response.data);
    } catch (error) {
      console.error('Error fetching group details:', error);
    }
  };  

  const handleGroupChange = (e) => {
    setGroupData((prevData) => ({
      ...prevData,
      nama_grup: e.target.value,
    }));
  };

  const handleDeskripsiChange = (e) => {
    setGroupData((prevData) => ({
      ...prevData,
      deskripsi: e.target.value,
    }));
  };

  const handleRecipientChange = (e, index) => {
    const { name, value } = e.target;
    const newRecipients = [...groupData.recipients];
    newRecipients[index][name] = value === "" ? null : value;
    setGroupData((prevData) => ({
      ...prevData,
      recipients: newRecipients,
    }));
  };  

  const addRecipient = () => {
    setGroupData((prevData) => ({
      ...prevData,
      recipients: [...prevData.recipients, { id_recipient: null }],
    }));
  };

  const removeRecipient = (index) => {
    const newRecipients = [...groupData.recipients];
    newRecipients.splice(index, 1);
    setGroupData((prevData) => ({
      ...prevData,
      recipients: newRecipients,
    }));
  };

  const handleSave = async () => {
    try {
      const filteredRecipients = groupData.recipients.filter(recipient => recipient.id_recipient != null);
      await axios.put(`http://localhost:5005/groups/${groupId}`, {
        nama_grup: groupData.nama_grup,
        deskripsi: groupData.deskripsi,
        recipients: filteredRecipients,
      });

      reloadData();
      modalRef.current.click();

      Swal.fire({
        icon: 'success',
        title: 'Group Recipient Message Edited!',
        showConfirmButton: true,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error updating group:', error);

      Swal.fire({
        icon: 'success',
        title: 'Group Recipient Message Not Edited!',
        showConfirmButton: true,
        timer: 1500,
      });
    }
  }; 

  return (
    <div className={`modal fade`} id="editGroupModal" tabIndex="-1" aria-labelledby="editGroupModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="editGroupModalLabel">Edit Group Recipient</h5>
            <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="namagroup" className="form-label">Group Name</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Add group name"
                  value={groupData.nama_grup}
                  onChange={handleGroupChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="pembuka" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  type="text"
                  placeholder="Add description group"
                  style={{ height: '100px' }}
                  value={groupData.deskripsi}
                  onChange={handleDeskripsiChange}
                ></textarea>
              </div>
              {groupData.recipients.map((recipient, index) => (
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
                        Choose Recipient
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
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGroupModal;
