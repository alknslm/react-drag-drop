// src/components/Sidebar.js
import React from 'react';
import DraggableSidebarItem from './DraggableSidebarItem';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h3>Componentler</h3>
            <p>Sürükleyip sağdaki alana bırakın.</p>
            <div className="sidebar-items">
                <DraggableSidebarItem type="square">Kare</DraggableSidebarItem>
                <DraggableSidebarItem type="l-shape">L Masa</DraggableSidebarItem>
            </div>
        </div>
    );
};

export default Sidebar;