import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import QRCode from "qrcode.react";

const Autentikasi = ({}) => {
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState("");
    const [msg, setMessage] = useState("");
    const [qrcode, setQRCode] = useState(false);

    // setPhone("+6283150955902");
    // setMessage("Auth WA");

    const getQRCode = async () => {
        setLoading(true);
        try {
          console.log("kontak", phone, msg);
          const res = await axios.post("http://localhost:5005/authenticate", { phone, msg });
          console.log(res.data);
          setQRCode(res.data);
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
          // Handle error, e.g., show an alert to the user
        }
      };      
    
    useEffect(() => {
        feather.replace(); // Replace the icons after component mount

        // setPhone("+6283150955902");
        // setMessage("Halo");

        console.log(phone, msg);
        // setQRCode("2@CtIk+UF+ASdbKNLR9qz0IRQjD0YkE2i1TWp6sUpyBl/2SvszMTWXZ8XGmrytoy7FVjZQfk5680RUgg==,F4FGmjAhRpF6IGl8/FcMWFSNQq325YedXwT44Y+diVE=,gjzN6CHbj06ASNlP0oOx5DZYD7t1U6adPL4J85T72VI=,NgDAe2Mg72M9+gwaY1PIkyBIELIeyL8od6Sh3+9SAKI=,1");
        // Panggil getQRCode jika phone dan msg sudah terisi
        // if (phone && msg) {
        //     console.log("tes");
        //     getQRCode();
        // }
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

            <section class="section dashboard">
            <div class="row">

                <div class="col-lg-12">
                <div class="row">

                    {/* <div class="col-xxl-4 col-xl-12"> */}

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
                                    <h3 className='mt-5'>Isi Form Berikut</h3>
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
                                    <button type="button" class="btn btn-primary" onClick={getQRCode}>Get QR Code</button>
                                    {/* <p>Phone Number:</p>
                                    <input value={phone} onChange={(e) => setPhone(e.target.value)} />
                                    <p class="mt-4">Message:</p>
                                    <input  value={msg} onChange={(e) => setMessage(e.target.value)} /><br/>
                                    <button onClick={getQRCode}>Get QRCode</button> */}
                                </div>
                                <div class="col-lg-4">
                                    {!loading && qrcode && (
                                        // <div style={{ margin: "100px" }}>
                                        <QRCode value={qrcode} size={256} style={{ marginBottom: '30px' }} />
                                        // </div>
                                    )}
                                    {loading && "Waiting for QRCode..."}
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
