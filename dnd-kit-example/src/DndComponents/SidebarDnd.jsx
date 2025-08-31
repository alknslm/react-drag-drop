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
                <DraggableSidebarItem id="table-1" type="canvas-item" typeForCss="square">Kare</DraggableSidebarItem>
                <DraggableSidebarItem id="table-2" type="canvas-item" typeForCss="l-shape">L Masa</DraggableSidebarItem>
            </div>

            <div className="sidebar-items">
                <div style={{alignItems : 'center'}}>MALZEMELER</div>
                <DraggableSidebarItem id="monitor-1" type="table-items" typeForCss="curved-monitor">Curved Monitör</DraggableSidebarItem>
                <DraggableSidebarItem id="monitor-2" type="table-items" typeForCss="flat-monitor">Düz Monitör</DraggableSidebarItem>
                <DraggableSidebarItem id="kasa-1" type="computer-tower" typeForCss="computer-tower">computer-tower</DraggableSidebarItem>
            </div>
        </div>
    );
};

export default Sidebar;