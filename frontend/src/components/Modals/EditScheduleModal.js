import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'simple-datatables';
import Swal from 'sweetalert2';

const EditScheduleModal = ({ reloadData, selectedScheduleId }) => {
    const [selectedRecipient, setSelectedRecipient] = useState([]);
    const [recipientData, setRecipientData] = useState([{
      id_recipient: '',
    }]);
    const [templateMessages, setTemplateMessage] = useState([]);
    const [activityData, setActivityData] = useState([]);

    const [groupData, setGroupData] = useState([]);

    const [formData, setFormData] = useState({
      id_message: '',
      jenis_message: '',
      id_activity: null,
      jenis_schedule: '',
      tanggal_mulai: '',
      tanggal_akhir: '',
      waktu: '',
      id_grup: '',
      recipient_list: [],
    });

    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef()

    useEffect(() => {
      if (selectedScheduleId) {
        fetchScheduleData();
        fetchtTemplateMessage();
        fetchActivityData();
        fetchGroupData();
      }
    }, [selectedScheduleId]);

    const fetchScheduleData = async () => {
      try {
        const response = await axios.get(`http://localhost:5005/schedule/${selectedScheduleId}`);
        const scheduleData = response.data;
  
        setFormData({
          id_message: scheduleData.id_message,
          jenis_message: scheduleData.jenis_message,
          id_activity: scheduleData.id_activity,
          jenis_schedule: scheduleData.jenis_schedule,
          tanggal_mulai: scheduleData.tanggal_mulai,
          tanggal_akhir: scheduleData.tanggal_akhir,
          waktu: scheduleData.waktu,
          id_grup: scheduleData.id_grup,
          recipient_list: scheduleData.recipient_list,
        });
  
        const allRecipientIds = scheduleData.recipient_list.map((recipient) => recipient.id);
        setSelectedRecipient(allRecipientIds);
  
        const updatedRecipientData = scheduleData.recipient_list.map((recipient) => ({
          id_recipient: recipient.id_recipient,
        }));
        setRecipientData(updatedRecipientData);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
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

    const fetchActivityData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/activity');
        setActivityData(response.data);
      } catch (error) {
        console.error('Error fetching data activity:', error);
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
          const table = new DataTable('.datatable-recipient-edit', {
            paging: false,
            columns : [
              { select : 0, sortable : false }
            ],
            scrollY: '300px',
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
        setRecipientData(selectedGroup.recipients.map((recipient) => ({ id_recipient: recipient.id_recipient })));
        console.log('selectedGroup', selectedGroup)
      }
      // Filter and set recipientData based on the selected group
      
      console.log('formdata', formData);
    };

    useEffect(() => {
      // Initialize selectedRecipient with all recipient ids
      const allRecipientIds = formData.recipient_list.map((recipient) => recipient.id);
      setSelectedRecipient(allRecipientIds);

      const updatedRecipientData = formData.recipient_list.map((recipient) => ({ id_recipient: recipient.id_recipient }));
      setRecipientData(updatedRecipientData);
    }, [formData.recipient_list]);

    const handleCheckboxChange = (id, id_recipient) => {
      // Mengecek apakah id sudah ada di dalam array selectedRows
      if (selectedRecipient.includes(id)) {
        // Jika sudah ada, maka hapus dari array
        setSelectedRecipient((prevSelected) =>
          prevSelected.filter((rowId) => rowId !== id)
        );

        setRecipientData((prevRecipientData) => prevRecipientData.filter((recipient) => recipient.id_recipient !== id_recipient));
      } else {
        // Jika belum ada, tambahkan ke array
        setSelectedRecipient([...selectedRecipient, id]);
        setRecipientData([...recipientData, { id_recipient }]);
      }

      console.log('selectedRecipient', selectedRecipient);
    };

    const submit = (e) => {
      e.preventDefault();
      console.log('submit', formData);
      console.log('selectedRecipient', selectedRecipient);
    };

    const handleSubmit = async () => {
      console.log('formData', formData);
      console.log('selectedRecipient', recipientData);
      try {
        const response = await axios.put(`http://localhost:5005/schedule/${selectedScheduleId}`, {
          id_message: formData.id_message,
          jenis_message: formData.jenis_message,
          id_activity: formData.id_activity,
          jenis_schedule: formData.jenis_schedule,
          tanggal_mulai: formData.tanggal_mulai,
          tanggal_akhir: formData.tanggal_akhir || formData.tanggal_mulai,
          waktu: formData.waktu,
          recipient_list: recipientData,
        });
        console.log('response', response);
        Swal.fire({
          icon: 'success',
          title: 'Schedule berhasil diubah!',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          reloadData();
          modalRef.current.click();
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal merubah schedule',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }

    return (
        <div className={`modal fade`} id="editScheduleModal" tabIndex="-1" aria-labelledby="editScheduleModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editScheduleModalLabel">Edit Data Schedule</h5>
                <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                  <form onSubmit={submit}>
                    <div className="mb-3">
                        <label htmlFor="pembuka" className="form-label">Template Pesan</label>
                        {/* nanti harus retrieve dulu dari db  */}
                        <select
                          className="form-select"
                          name="id_message"
                          onChange={(e) => handleInputChange(e)}
                          value={formData.id_message}
                          required
                        >
                          <option value="">Pilih Template Message</option>
                            {templateMessages.map((template, index) => (
                              <option key={index} value={template.id}>
                                {template.message}
                              </option>
                            ))}
                        </select>
                    </div>
                    {formData.jenis_message === 'activity' && (
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
                          <option value="">Activity</option>
                          {activityData.map((activity, index) => (
                              <option key={index} value={activity.id_activity}>
                                {activity.activity_name} - {activity.activity_date}
                              </option>
                          ))}
                        </select>
                    </div>
                    )}
                    
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Jenis Schedule</label>
                      <select
                        className="form-select"
                        name="jenis_schedule"
                        onChange={(e) => handleInputChange(e)}
                        value={formData.jenis_schedule}
                        required
                      >
                        <option value="">Pilih Jenis Schedule</option>
                        <option value="once">Once</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                    <div className="mb-3 row">
                      <div className='col-md-4'>
                        <label htmlFor="message" className="form-label">Tanggal Mulai</label>
                        <input
                          type="date"
                          className="form-control"
                          name="tanggal_mulai"
                          onChange={(e) => handleInputChange(e)}
                          value={formData.tanggal_mulai}
                          required
                        />
                      </div>
                      {formData.jenis_schedule != 'once' && (
                        <div className='col-md-4'>
                          <label htmlFor="message" className="form-label">Tanggal Akhir</label>
                          <input
                            type="date"
                            className="form-control"
                            name="tanggal_akhir"
                            onChange={(e) => handleInputChange(e)}
                            value={formData.tanggal_akhir}
                            required
                          />
                        </div>
                      )}
                      
                      <div className='col-md-4'>
                        <label htmlFor="message" className="form-label">Waktu</label>
                        <input
                          type="time"
                          className="form-control"
                          name="waktu"
                          onChange={(e) => handleInputChange(e)}
                          value={formData.waktu}
                          min="00:00"
                          max="23:59"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Recipient Group</label>
                      <select
                        className="form-select"
                        name="id_grup"
                        onChange={(e) => handleInputChange(e)}
                        value={formData.id_grup}
                        required
                      >
                        <option value="">Pilih Group</option>
                        {groupData.map((group, index) => (
                            <option key={index} value={group.id}>
                              {group.nama_grup}
                            </option>
                        ))}
                      </select>
                    </div>
                    <div className='mb-3'>
                    <label className="form-label">Recipient List</label>
                    <table className="table datatable-recipient-edit table-striped">
                      <thead>
                        <tr>
                          <th></th>
                          <th>No</th>
                          <th>Nama</th>
                          <th>No Whatsapp</th>
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
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={()=>handleSubmit()}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
    );
}

export default EditScheduleModal;