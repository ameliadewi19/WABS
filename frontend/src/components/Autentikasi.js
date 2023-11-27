import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import QRCode from 'react-qr-code';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from 'sweetalert2'; 

const Autentikasi = ({}) => {
    const [loading, setLoading] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [phone, setPhone] = useState("");
    const [msg, setMessage] = useState("");
    const [qrcode, setQRCode] = useState(false);
    const [loginStatus, setLoginStatus] = useState("Loading");
    const [check, setCheck] = useState(false);
    const [loadingSend, setLoadingSend] = useState(false);
    const [loadingLogout, setLoadingLogout] = useState(false);

    const MySwal = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-primary me-2',
        },
        buttonsStyling: false,
    });

    useEffect(() => {
        if (check === false) {
            console.log("Check status");
            setCheck(true);
            getLoginStatus();
        }
    }, []);   

    const getQRCode = async () => {
        setLoading(true);
        try {
          console.log("kontak", phone, msg);
          const res = await axios.get("http://localhost:5005/getQRCode");
          console.log(res.data);
          setQRCode(res.data.qrCodeData);
          setLoading(false);

        } catch (error) {
          console.error(error);
          setLoading(false);
          // Handle error, e.g., show an alert to the user
        } 

        // getLoginStatus();
      };      
    
    const getLoginStatus = async () => {
        console.log("getLoginStatus");
        try {
          const res = await axios.get("http://localhost:5005/getAuthStatus");
          console.log(res.data);
          setLoginStatus(res.data);
          setQRCode(null);

        //   if (res.data === 'Not Authenticated') {
        //     setTimeout(() => {
        //         getQRCode();
        //     }, 3000); 
        //   }
        } catch (error) {
          console.error(error);
        }
    };  

    const Logout = async () => {
        setLoadingLogout(true);
        try {
          const res = await axios.get("http://localhost:5005/logout");
          console.log(res.data);
        //   setLoginStatus(res.data);
        
          if (res.status === 200) {
            MySwal.fire({
                icon: 'success',
                title: 'Logout success!',
                showConfirmButton: true,
                // timer: 1500,
            });
          }
          getLoginStatus();
          setLoadingLogout(false);
        } catch (error) {
          console.error(error);
          MySwal.fire({
            icon: 'success',
            title: 'Logout error!',
            showConfirmButton: true,
            // timer: 1500,
          });
        }
    };  

    const testClient = async () => {
        setLoadingSend(true);
        try {
            // console.log("kontak", phone, msg);
            const res = await axios.post("http://localhost:5005/test-client", {
                phone,
                msg,
            });
            console.log(res.data);

            if (res.status === 200) {
                MySwal.fire({
                    icon: 'success',
                    title: 'Message sent!',
                    showConfirmButton: true,
                    // timer: 1500,
                });

                setLoadingSend(false);
            }
        } catch (error) {
            console.error(error);

            MySwal.fire({
                icon: 'error',
                title: 'Error sending message!',
                showConfirmButton: true,
                // timer: 1500,
            });
        }
    };   
    
    const handleRefresh = () => {
        setCheck(true); // Potentially triggers re-render  
        window.location.reload(false);
    };      

    return (
        <main id="main" class="main">
            <div class="pagetitle">
            <h1>Dashboard</h1>
            <nav>
                <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li class="breadcrumb-item active">WhatsApp Authecation</li>
                </ol>
            </nav>
            </div>

            <section class="section dashboard mb-5">
            <div class="row">

                <div class="col-lg-12">
                <div class="row">


                    <div class="card info-card customers-card">
                        <div class="card-body">
                            {loginStatus && (
                                <div className="row">
                                    <div className='col-md-10'>
                                        <h5 className="card-title mb-0">WhatsApp Authentication</h5>
                                        <p className="mb-0">Wait for the auth status to be successfully retrieved.</p>
                                    </div>
                                    <div className="col text-end">
                                        <h5 className="card-title me-2">Status: </h5>
                                        <div style={{ background: loginStatus === 'Authenticated' ? '#28a745' : (loginStatus === 'Loading' ? '#ffc107' : (loginStatus === '-' ? '#f8f9fa' : '#dc3545')), color: '#fff', padding: '10px', borderRadius: '5px', display: 'inline-block' }}>
                                            {loginStatus} {loginStatus === 'Loading' && <i className="fas fa-spinner fa-spin"></i>}
                                        </div>

                                    </div>
                                </div>                       
                            )}
                            <div class="row">
                                <div class="col-lg-8">
                                    
                                    {/* <button type="button" class="btn btn-primary me-2" onClick={getLoginStatus}><i className='bi bi-info-circle me-1'></i> Login Status</button> */}
                                    {loginStatus === 'Authenticated' && 
                                        <>
                                        <h3 className='mt-3' style={{fontWeight: 'bold'}}>Test Client</h3>
                                        <div class="row mb-3">
                                        <label for="inputText" class="col-sm-2 col-form-label">No Telepon</label>
                                            <div class="col-sm-10">
                                                <input type="text" class="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="No Telepon"/>
                                            </div>
                                            </div>
                                        <div class="row mb-3">
                                            <label for="inputEmail" class="col-sm-2 col-form-label">Pesan</label>
                                            <div class="col-sm-10">
                                            <textarea className="form-control" style={{ height: '70px' }} value={msg} onChange={(e) => setMessage(e.target.value)} placeholder="Isi pesan"></textarea>
                                            </div>
                                        </div>
                                        <button type="button" class="btn btn-primary me-2 mt-2" onClick={testClient}>{loadingSend === true ? <i className="fas fa-spinner fa-spin"></i> : <i className='bi bi-send me-1'></i> } Send</button>
                                        <button type="button" class="btn btn-danger me-2 mt-2" onClick={Logout}>{loadingLogout === true ? <i className="fas fa-spinner fa-spin"></i> : <i className='bi bi-box-arrow-in-left me-1'></i> } Logout WA</button>
                                    </>
                                    }

                                    {loginStatus === 'Not Authenticated' && 
                                    <>
                                        <h3 className='mt-3' style={{fontWeight: 'bold'}}>Connect to WhatsApp</h3>
                                        <p>1. Open WhatsApp on your phone</p>
                                        <p>2. Go to settings by tapping on your profile photo <span style={{fontWeight: "bold"}}>Menu <i className='bi bi-three-dots-vertical'></i></span> atau <span style={{fontWeight: "bold"}}>Setelan <i className='bi bi-gear'></i> </span></p>
                                        <p>3. Tap <span style={{fontWeight: "bold"}}>Linked device</span>, and then <span style={{fontWeight: "bold"}}>Linked a device</span></p>
                                        <p>4. Point your phone to this screen to capture the QR code</p>
                                        <button type="button" class="btn btn-success me-2" onClick={getQRCode}><i className='bi bi-box-arrow-in-right me-1'></i> Login WA</button> 
                                        <button type="button" class="btn btn-primary me-2" onClick={handleRefresh}><i className='bi bi-arrow-clockwise me-1'></i> Refresh</button>
                                    </>
                                    }
                                </div>
                                <div class="col-lg-4 mt-4 text-end">
                                    {!loading && qrcode && (
                                        // <div style={{ margin: "100px" }}>
                                        <QRCode value={qrcode} size={256} style={{ marginBottom: '0px', marginTop: '5px'}} />
                                        // </div>
                                    )}
                                    {loading && 
                                        <div className="text-center mt-4">
                                            <i className="fas fa-spinner fa-spin fa-2x"></i>
                                        </div>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* </div> */}

                </div>
                </div>

            </div>
            </section>

        </main>
    );
};

export default Autentikasi;
