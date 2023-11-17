import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import { DataTable } from 'simple-datatables';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import EditGroupModal from './Modals/EditGroupModal';
import AddGroupModal from './Modals/AddGroupModal';

const GroupRecipient = ({ }) => {
  const location = useLocation();
  const [groups, setGroups] = useState([]);
  const MySwal = withReactContent(Swal);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    feather.replace();
    fetchData();
  }, []);

  useEffect(() => {
    // Initialize the datatable here
    if (groups.length > 0) {
      const table = new DataTable('.datatable');
    }
  }, [groups]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5005/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDelete = (id) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this group!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked Yes, proceed with deletion
        deleteGroup(id);
      }
    });
  };
  
  const deleteGroup = async (id) => {
    try {
      // Call your delete API endpoint
      await axios.delete(`http://localhost:5005/groups/${id}`);
  
      // Reload the data after deleting
      fetchData();
  
      MySwal.fire('Deleted!', 'Your group has been deleted.', 'success');
    } catch (error) {
      console.error('Error deleting group:', error);
      MySwal.fire('Error!', 'An error occurred while deleting the group.', 'error');
    }
  };  

  const handleEdit = (group) => {
    setSelectedGroup(group);
    console.log("group: ", group);
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>Group Recipient</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
            <li className="breadcrumb-item active">Group Recipient</li>
          </ol>
        </nav>
      </div>

      <section className="section">
        <div className="row">
          <div className="col-lg-12">

            <div className="card">
              <div className="card-body">
                <div className='row'>
                  <div className='col-md-6'>
                    <h5 className="card-title">Group Recipient</h5>
                    <p>Group yang berisikan list recipient</p>
                  </div>
                  <div className='col-md-6'>
                    <div className='d-flex justify-content-end'>
                      <button type="button" className="btn btn-primary me-2 mt-3" data-bs-toggle="modal" data-bs-target="#addGroupModal"><i className='bi bi-plus'></i>Tambah Group</button>
                      <AddGroupModal reloadData={fetchData} />
                    </div>
                  </div>
                </div>


                <table className="table datatable">
                  <thead>
                    <tr>
                      <th >No</th>
                      <th >Nama Grup</th>
                      <th >Deskripsi</th>
                      <th >Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{group.nama_grup}</td>
                        <td>{group.deskripsi}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() => handleEdit(group.id)}
                              data-bs-toggle="modal"
                              data-bs-target="#editGroupModal"
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <EditGroupModal
                              reloadData={fetchData}
                              groupId={selectedGroup}
                            />
                            <button type="button" className="btn btn-danger" onClick={() => handleDelete(group.id)}>
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
};

export default GroupRecipient;
