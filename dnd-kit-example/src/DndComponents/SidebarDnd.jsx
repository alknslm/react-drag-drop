// src/components/Sidebar.js
import React from 'react';
import DraggableSidebarItem from './DraggableSidebarItem';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div>
                <h3>Componentler</h3>
                <p>Sürükleyip sağdaki alana bırakın.</p>
            </div>

            <div className="sidebar-furniture">
                <p>MOBİLYA</p>
                <DraggableSidebarItem type="square">Kare</DraggableSidebarItem>
                <DraggableSidebarItem type="l-shape">L Masa</DraggableSidebarItem>
            </div>

            <div className="sidebar-items">
                <div style={{alignItems : 'center'}}>MALZEMELER</div>
                <DraggableSidebarItem type="curved-monitor">Curved Monitör</DraggableSidebarItem>
                <DraggableSidebarItem type="flat-monitor">Düz Monitör</DraggableSidebarItem>
                <DraggableSidebarItem type="computer-tower">computer-tower</DraggableSidebarItem>
            </div>
        </div>
    );
};

export default Sidebar;