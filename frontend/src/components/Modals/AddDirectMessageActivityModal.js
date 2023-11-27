import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'simple-datatables';
import Swal from 'sweetalert2';

const AddDirectMessageActivityModal = ({ reloadData, idTemplate }) => {
    const [selectedRecipient, setSelectedRecipient] = useState([]);
    const [recipientData, setRecipientData] = useState([]);
    const [templateMessages, setTemplateMessage] = useState([]);
    const [activityData, setActivityData] = useState([]);

    const [groupData, setGroupData] = useState([]);

    const [formData, setFormData] = useState({
      // idTemplate: idTemplate,
      id_grup: '',
      recipient_list: [],
      id_activity: null,
    });

    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef()

    useEffect(() => {
      fetchtTemplateMessage();
      fetchGroupData();
      fetchActivityData();
    }, []);

    const fetchRecipientData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/recipient');
        setRecipientData(response.data);
      } catch (error) {
        console.error('Error fetching data recipient:', error);
      }
    };

    const fetchActivityData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/activity');
        setActivityData(response.data);
      } catch (error) {
        console.error('Error fetching data activity:', error);
      }
    };

    const fetchtTemplateMessage = async () => {
      try {
        const response = await axios.get('http://localhost:5005/template-messages');
        setTemplateMessage(response.data);
      } catch (error) {
        console.error('Error fetching data template:', error);
      }
    };

    const fetchGroupData = async () => { 
      try {
        const response = await axios.get('http://localhost:5005/groups/');
        setGroupData(response.data);
      } catch (error) {
        console.error('Error fetching data groups:', error);
      }
    };

    useEffect(() => {
      // Initialize the datatable here
      if (formData.recipient_list.length > 0) {
          const table = new DataTable('.datatable-recipient', {
            paging: false,
            columns : [
              { select : 0, sortable : false }
            ],
          });
      }

    }, [formData.recipient_list]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
    
      // Jika name adalah 'id_message', cari jenis_message berdasarkan id_message
      if (name === 'id_message') {
        console.log('value', value);
        console.log('templateMessages', templateMessages);
        const selectedTemplate = templateMessages.find(template => template.id == value);
        const jenisMessageValue = selectedTemplate.jenis_template
        console.log('jenisMessageValue', jenisMessageValue);
        
        setFormData(prevFormData => ({
          ...prevFormData,
          [name]: value,
          jenis_message: jenisMessageValue,
        }));
      } else {
        setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
      }

      if(name === 'id_grup') {
        const selectedGroup = groupData.find((group) => group.id === parseInt(value, 10));
        setFormData(prevFormData => ({ ...prevFormData, [name]: value, recipient_list: selectedGroup.recipients }));
        setRecipientData(selectedGroup.recipients);
        console.log('selectedGroup', selectedGroup)
      }
      // Filter and set recipientData based on the selected group
      
      console.log('formdata', formData);
    };

    useEffect(() => {
      // Initialize selectedRecipient with all recipient ids
      const allRecipientIds = formData.recipient_list.map((recipient) => recipient.id);
      setSelectedRecipient(allRecipientIds);
      const allRecipientDataId = formData.recipient_list.map((recipient) => recipient.id_recipient);
      setRecipientData(allRecipientDataId);
    }, [formData.recipient_list]);

    const handleCheckboxChange = (id, id_recipient) => {
      // Mengecek apakah id sudah ada di dalam array selectedRows
      if (selectedRecipient.includes(id)) {
        // Jika sudah ada, maka hapus dari array
        setSelectedRecipient((prevSelected) =>
          prevSelected.filter((rowId) => rowId !== id)
        );
        setRecipientData((prevSelected) =>
          prevSelected.filter((rowId) => rowId !== id_recipient)
        );
      } else {
        // Jika belum ada, tambahkan ke array
        setSelectedRecipient([...selectedRecipient, id]);
        setRecipientData([...recipientData, id_recipient]);
      }

      console.log('selectedRecipient', selectedRecipient);
    };

    const submit = (e) => {
      e.preventDefault();
      console.log('submit', formData);
      console.log('selectedRecipient', selectedRecipient);
    };

    const handleSubmit = async () => {
      console.log("id template: ", idTemplate);
      console.log('selectedRecipient', recipientData);
      try {
        const response = await axios.post('http://localhost:5005/direct-message-activity', {
          id_template: idTemplate,
          recipientList: recipientData,
          id_activity: formData.id_activity,
        });
        console.log('response', response);

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Pesan terkirim!',
          text: 'Pesan berhasil terkirim kepada penerima yang dipilih.',
        });

        reloadData();
        setShowModal(false);
      } catch (error) {
        console.error('Error fetching data:', error);

        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Gagal mengirim pesan',
          text: 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.',
        });
      }
    }

    return (
        <div className={`modal fade ${showModal ? 'show' : ''}`} id="addDirectMessageActivityModal" tabIndex="-1" aria-labelledby="addDirectMessageActivityModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addDirectMessageActivityModalLabel">Direct Message</h5>
                <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                  <form onSubmit={submit}>
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Recipient Group</label>
                      <select
                        className="form-select"
                        name="id_grup"
                        onChange={(e) => handleInputChange(e)}
                        value={formData.id_grup}
                        required
                      >
                        <option value="">Choose Group</option>
                        {groupData.map((group, index) => (
                            <option key={index} value={group.id}>
                              {group.nama_grup}
                            </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Activity</label>
                        {/* nanti harus retrieve dulu dari db  */}
                        <select
                          className="form-select"
                          name="id_activity"
                          onChange={(e) => handleInputChange(e)}
                          value={formData.id_activity}
                          required
                        >
                          <option value="" disabled selected>Choose Activity</option>
                          {activityData.map((activity, index) => (
                              <option key={index} value={activity.id_activity}>
                                {activity.activity_name} - {activity.activity_date}
                              </option>
                          ))}
                        </select>
                    </div>
                    <div className='mb-3'>
                    <label className="form-label">Recipient List</label>
                    <table className="table datatable-recipient table-striped">
                      <thead>
                        <tr>
                          <th></th>
                          <th>#</th>
                          <th>Name</th>
                          <th>Phone Number</th>
                        </tr>
                      </thead>
                      <tbody>
                      {formData.recipient_list.map((recipient, index) => (
                        <tr key={recipient.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRecipient.includes(recipient.id)}
                              onChange={() => handleCheckboxChange(recipient.id, recipient.id_recipient)}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{recipient.recipients.nama}</td>
                          <td>{recipient.recipients.no_whatsapp}</td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                    </div>
                  </form>
    
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={()=>handleSubmit()}>Send</button>
              </div>
            </div>
          </div>
        </div>
    );
}

export default AddDirectMessageActivityModal;