import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'simple-datatables';

const AddScheduleModal = ({ reloadData }) => {
    const [recipientList, setRecipientList] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState([]);
    const [recipientData, setRecipientData] = useState([]);
    const [formData, setFormData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef()

    useEffect(() => {
      fetchRecipientData();
    }, []);

    const fetchRecipientData = async () => {
      try {
        const response = await axios.get('http://localhost:5005/recipient');
        setRecipientData(response.data);
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
        setFormData({ ...formData, [name]: value });
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
    };

    return (
        <div className={`modal fade ${showModal ? 'show' : ''}`} id="addScheduleModal" tabIndex="-1" aria-labelledby="addScheduleModalLabel" aria-hidden={!showModal}>
          <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addScheduleModalLabel">Tambah Data Konfirmasi</h5>
                <button type="button" className="d-none" ref={modalRef} data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                  <form>
                    <div className="mb-3">
                        <label htmlFor="pembuka" className="form-label">Template Pesan</label>
                        {/* nanti harus retrieve dulu dari db  */}
                        <select
                          className="form-select"
                          name="jenis_kegiatan"
                          onChange={(e) => handleInputChange()}
                          value={formData.message}
                          required
                        >
                          <option value="" disabled>Jenis Kegiatan</option>
                          <option value="Karakter">Karakter</option>
                          <option value="Penalaran/Keilmuan">Penalaran/Keilmuan</option>
                          <option value="Peminatan">Peminatan</option>
                          <option value="Pengabdian">Pengabdian</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Activity</label>
                        {/* nanti harus retrieve dulu dari db  */}
                        <select
                          className="form-select"
                          name="jenis_kegiatan"
                          onChange={(e) => handleInputChange()}
                          value={formData.message}
                          required
                        >
                          <option value="" disabled>Jenis Kegiatan</option>
                          <option value="Karakter">Karakter</option>
                          <option value="Penalaran/Keilmuan">Penalaran/Keilmuan</option>
                          <option value="Peminatan">Peminatan</option>
                          <option value="Pengabdian">Pengabdian</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">Jenis Schedule</label> 
                        <select
                          className="form-select"
                          name="jenis_kegiatan"
                          onChange={(e) => handleInputChange()}
                          value={formData.message}
                          required
                        >
                          <option value="" disabled>Jenis Kegiatan</option>
                          <option value="harian">Harian</option>
                          <option value="mingguan">Mingguan</option>
                          <option value="bulanan">Bulanan</option>
                        </select>
                    </div>
                    <div className="mb-3 row">
                      <div className='col-md-4'>
                        <label htmlFor="message" className="form-label">Tanggal Mulai</label>
                        <input
                          type="date"
                          className="form-control"
                          name="tanggal_mulai"
                          onChange={(e) => handleInputChange()}
                          value={formData.message}
                          required
                        />
                      </div>
                      <div className='col-md-4'>
                        <label htmlFor="message" className="form-label">Tanggal Akhir</label>
                        <input
                          type="date"
                          className="form-control"
                          name="tanggal_mulai"
                          onChange={(e) => handleInputChange()}
                          value={formData.message}
                          required
                        />
                      </div>
                      <div className='col-md-4'>
                        <label htmlFor="message" className="form-label">Waktu</label>
                        <input
                          type="time"
                          className="form-control"
                          name="tanggal_mulai"
                          onChange={(e) => handleInputChange()}
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
                <button type="button" className="btn btn-primary" onClick={handleInputChange}>Simpan</button>
              </div>
            </div>
          </div>
        </div>
    );
}

export default AddScheduleModal;