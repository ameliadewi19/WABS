import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import QRCode from 'react-qr-code';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Autentikasi = ({}) => {
    const [loading, setLoading] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [phone, setPhone] = useState("");
    const [msg, setMessage] = useState("");
    const [qrcode, setQRCode] = useState(false);
    const [loginStatus, setLoginStatus] = useState("-");
    const [check, setCheck] = useState(false);

    const getQRCode = async () => {
        setLoading(true);
        try {
          console.log("kontak", phone, msg);
          const res = await axios.get("http://localhost:5005/getQRCode");
          console.log(res.data.qrCodeData);
          setQRCode(res.data.qrCodeData);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
          // Handle error, e.g., show an alert to the user
        }
      };      
    
    const getLoginStatus = async () => {
        setLoginStatus("Loading");
        try {
          console.log("kontak", phone, msg);
          const res = await axios.get("http://localhost:5005/getAuthStatus");
          console.log(res.data);
          setLoginStatus(res.data);
        } catch (error) {
          console.error(error);
        }
    };  

    const Logout = async () => {
        try {
          const res = await axios.get("http://localhost:5005/logout");
          console.log(res.data);
        //   setLoginStatus(res.data);
        } catch (error) {
          console.error(error);
        }
    };  

    const testClient = async () => {
        try {
            console.log("kontak", phone, msg);
            const res = await axios.post("http://localhost:5005/test-client", {
                phone,
                msg,
            });
            console.log(res.data);
            // setLoginStatus(res.data);
        } catch (error) {
            console.error(error);
        }
    };    
    
    
    useEffect(() => {
        feather.replace(); // Replace the icons after component mount

        console.log(phone, msg);
        if (check === false){
            getLoginStatus();
            setCheck(true);
        }

    }, [phone, msg]);


    return (
        <main id="main" class="main">
            <div class="pagetitle">
            <h1>Dashboard</h1>
            <nav>
                <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/dashboard">Home</a></li>
                <li class="breadcrumb-item active">Autentikasi Whatsapp</li>
                </ol>
            </nav>
            </div>

            <section class="section dashboard mb-5">
            <div class="row">

                <div class="col-lg-12">
                <div class="row">


                    <div class="card info-card customers-card">
                        <div class="card-body">
                            <h5 class="card-title">Autentikasi</h5>
                            <div class="row">
                                <div class="col-lg-8">
                                    <h3 className='mt-3'>Hubungkan WhastApp Anda</h3>
                                    <p>1. Buka Whatsapp di telepon Anda</p>
                                    <p>2. Buka setelan dengan mengetuk format foto profil Anda, <span style={{fontWeight: "bold"}}>Menu</span>, atau <span style={{fontWeight: "bold"}}>Setelan</span></p>
                                    <p>3. Ketuk <span style={{fontWeight: "bold"}}>Perangkat tertaut</span>, lalu <span style={{fontWeight: "bold"}}>Tautkan perangkat</span></p>
                                    <p>4. Isi form dibawah untuk test apakah pesan terkirim</p>
                                    <p>5. Arahkan telepon Anda ke layar ini untuk memindai kode QR</p>
                                    {/* <button type="button" class="btn btn-primary me-2" onClick={getLoginStatus}><i className='bi bi-info-circle me-1'></i> Login Status</button> */}
                                    {loginStatus === 'Authenticated' && 
                                        <>
                                        <button type="button" class="btn btn-danger me-2" onClick={Logout}><i className='bi bi-box-arrow-in-left me-1'></i> Logout WA</button>

                                        <h3 className='mt-5'>Tes Client</h3>
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
                                        <button type="button" class="btn btn-primary" onClick={testClient}><i className='bi bi-send me-1'></i> Send</button>
                                    </>
                                    }

                                    {loginStatus === 'Not Authenticated' && 
                                    <>
                                        <button type="button" class="btn btn-success me-2" onClick={getQRCode}><i className='bi bi-box-arrow-in-right me-1'></i> Login WA</button>
                                    </>
                                    }
                                </div>
                                <div class="col-lg-4">
                                    {loginStatus && (
                                    <div className="d-flex align-items-center">
                                        <h5 className="me-2">STATUS: </h5>
                                        <div className={`alert ${loginStatus === '-' ? 'alert-light' : (loginStatus === 'Authenticated' ? 'alert-success' : (loginStatus === 'Loading' ? 'alert-warning' : 'alert-danger'))}`} style={{ paddingBottom: '0px', paddingTop: '10px' }}>
                                            <p>{loginStatus}</p>
                                        </div>
                                    </div>
                                    )}

                                    {!loading && qrcode && (
                                        // <div style={{ margin: "100px" }}>
                                        <QRCode value={qrcode} size={256} style={{ marginBottom: '30px', marginTop: '5px'}} />
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
