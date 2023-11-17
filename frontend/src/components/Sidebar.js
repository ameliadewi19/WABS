import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import feather from 'feather-icons';

const Sidebar = ({}) => {
    const location = useLocation();
    
    useEffect(() => {
        feather.replace(); // Replace the icons after component mounts
    }, []);

    return (
        <aside id="sidebar" className="sidebar">

            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item ">
                    <a className={`nav-link ${location.pathname === '/dashboard' ? '' : 'collapsed'}`} href="/dashboard">
                    <i className="bi bi-grid"></i>
                    <span>Dashboard</span>
                    </a>
                </li>

                <li className="nav-item">
                    <a className={`nav-link ${location.pathname === '/autentikasi-wbm' ? '' : 'collapsed'}`} href="/autentikasi-wbm">
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span>Autentikasi Whatsapp</span>
                    </a>
                </li>

                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/recipient' ? '' : 'collapsed'}`} href="/recipient">
                    <i className="bi bi-person"></i>
                    <span>Recipient</span>
                    </a>
                </li>

                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/group-recipient' ? '' : 'collapsed'}`} href="/group-recipient">
                    <i className="bi bi-people"></i>
                    <span>Group Recipient</span>
                    </a>
                </li>

                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/direct-message' ? '' : 'collapsed'}`} href="/direct-message">
                    <i className="bi bi-grid"></i>
                    <span>Direct Message</span>
                    </a>
                </li>

                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/schedule-message' ? '' : 'collapsed'}`} href="/schedule-message">
                    <i className="bi bi-envelope"></i>
                    <span>Schedule Message</span>
                    </a>
                </li>

                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/aktivitas' ? '' : 'collapsed'}`} href="/aktivitas">
                    <i className="bi bi-layout-text-window-reverse"></i>
                    <span>List Aktivitas</span>
                    </a>
                </li>
                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/template' ? '' : 'collapsed'}`} href="/template">
                    <i className="bi bi-chat-text"></i>
                    <span>Template Message</span>
                    </a>
                </li>
            </ul>

        </aside>
    );
};

export default Sidebar;
