import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'simple-datatables';
// import { set } from 'date-fns';

const AddScheduleModal = ({ reloadData }) => {
    const [selectedRecipient, setSelectedRecipient] = useState([]);
    const [recipientData, setRecipientData] = useState([]);
    const [templateMessages, setTemplateMessage] = useState([]);
    const [activityData, setActivityData] = useState([]);

    const [groupData, setGroupData] = useState([]);

    const [formData, setFormData] = useState({
      id_message: '',
      jenis_message: '',
      id_activity: '',
      jenis_schedule: '',
      tanggal_mulai: '',
      tanggal_akhir: '',
      waktu: '',
    
    });
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef()

    useEffect(() => {
      fetchRecipientData();
      fetchtTemplateMessage();
      fetchActivityData();
      console.log('templet', templateMessages);
      console.log('activity', activityData);
    }, []);

    const fetchRecipientData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/recipient');
        setRecipientData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchtTemplateMessage = async () => {
      try {
        const response = await axios.get('http://localhost:5005/template-messages');
        setTemplateMessage(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetchActivityData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/activity');
        setActivityData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    useEffect(() => {
      // Initialize the datatable here
      if (recipientData.length > 0) {
          const table = new DataTable('.datatable-recipient', {
            perPage: 5,
            columns : [
              { select : 0, sortable : false }
            ],
          });
      }
    }, [recipientData]);

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
      console.log('formdata', formData);
    };

    const handleCheckboxChange = (id) => {
      // Mengecek apakah id sudah ada di dalam array selectedRows
      if (selectedRecipient.includes(id)) {
        // Jika sudah ada, maka hapus dari array
        setSelectedRecipient(selectedRecipient.filter(rowId => rowId !== id));
      } else {
        // Jika belum ada, tambahkan ke array
        setSelectedRecipient([...selectedRecipient, id]);
      }

      console.log('selectedRecipient', selectedRecipient);
    };

    const submit = (e) => {
      e.preventDefault();
      console.log('submit', formData);
      console.log('selectedRecipient', selectedRecipient);
    };

    const handleSubmit = async () => {
      try {
        // const response = await axios.post('http://localhost:5005/schedule', {
        //   id_message: formData.id_message,
        //   jenis_message: formData.jenis_message,
        //   id_actvity: formData.id_actvity,
        //   jenis_schedule: formData.jenis_schedule,
        //   tanggal_mulai: formData.tanggal_mulai,
        //   tanggal_akhir: formData.tanggal_akhir,
        //   waktu: formData.waktu,
        //   id_recipient: selectedRecipient,
        // });
        // console.log('response', response);
        console.log('formData', formData);
        console.log('selectedRecipient', selectedRecipient);
        reloadData();
        setShowModal(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    return (
        <div className={`modal fade ${showModal ? 'show' : ''}`} id="addScheduleModal" tabIndex="-1" aria-labelledby="addScheduleModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addScheduleModalLabel">Tambah Data Konfirmasi</h5>
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
                          value={formData.message}
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
                            value={formData.message}
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
                          value={formData.message}
                          min="00:00"
                          max="23:59"
                          required
                        />
                      </div>
                    </div>
                    <div className='mb-3'>
                    <label className="form-label">Recipient List</label>
                    <table className="table datatable-recipient table-striped">
                      <thead>
                        <tr>
                          <th></th>
                          <th>No</th>
                          <th>Nama</th>
                          <th>No Whatsapp</th>
                        </tr>
                      </thead>
                      <tbody>
                      {recipientData.map((recipient, index) => (
                        <tr key={recipient.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedRecipient.includes(recipient.id)}
                              onChange={() => handleCheckboxChange(recipient.id)}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{recipient.nama}</td>
                          <td>{recipient.no_whatsapp}</td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                    </div>
                  </form>
    
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setShowModal(false)}>Tutup</button>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
    );
}

export default AddScheduleModal;