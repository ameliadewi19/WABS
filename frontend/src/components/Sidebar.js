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
                    <i className="bi bi-whatsapp"></i>
                    <span>WhatsApp Authecation</span>
                    </a>
                </li>

                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/recipient' ? '' : 'collapsed'}`} href="/recipient">
                    <i className="bi bi-person"></i>
                    <span>Recipients</span>
                    </a>
                </li>

                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/group-recipient' ? '' : 'collapsed'}`} href="/group-recipient">
                    <i className="bi bi-people"></i>
                    <span>Recipient Groups</span>
                    </a>
                </li>

                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/direct-message' ? '' : 'collapsed'}`} href="/direct-message">
                    <i className="bi bi-send"></i>
                    <span>Direct Message</span>
                    </a>
                </li>

                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/schedule-message' ? '' : 'collapsed'}`} href="/schedule-message">
                    <i className="bi bi-envelope-plus"></i>
                    <span>Schedules</span>
                    </a>
                </li>

                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/aktivitas' ? '' : 'collapsed'}`} href="/aktivitas">
                    <i className="bi bi-layout-text-window-reverse"></i>
                    <span>Activities</span>
                    </a>
                </li>
                <li className="nav-item">
                <a className={`nav-link ${location.pathname === '/template' ? '' : 'collapsed'}`} href="/template">
                    <i className="bi bi-chat-text"></i>
                    <span>Message Templates</span>
                    </a>
                </li>
            </ul>

        </aside>
    );
};

export default Sidebar;
