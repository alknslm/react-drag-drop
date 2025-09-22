// src/components/Sidebar.jsx
import React from 'react';
import DraggableSidebarItem from './DraggableSidebarItem';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>🏗️ Kroki Componentleri</h3>
                <p>Sürükleyip sağdaki alana bırakın.</p>
            </div>

            {/* MOBİLYALAR — canvas-item tipi (ResizableContainerItem) */}
            <div className="sidebar-section">
                <h4>🪑 MOBİLYALAR</h4>
                <DraggableSidebarItem id="square-table" type="canvas-item" typeForCss="square">
                    🪑 Kare Masa
                </DraggableSidebarItem>
                <DraggableSidebarItem id="l-shaped-table" type="canvas-item" typeForCss="l-shape">
                    🪑 L-Şekilli Masa
                </DraggableSidebarItem>
            </div>

            {/* MALZEMELER — static-child tipi (StaticChildItem) */}
            <div className="sidebar-section">
                <h4>🖥️ OFİS MALZEMELERİ</h4>
                <DraggableSidebarItem id="curved-monitor" type="static-child" typeForCss="curved-monitor">
                    🖥️ Curved Monitör
                </DraggableSidebarItem>
                <DraggableSidebarItem id="flat-monitor" type="static-child" typeForCss="flat-monitor">
                    🖥️ Düz Monitör
                </DraggableSidebarItem>
                <DraggableSidebarItem id="computer-tower" type="static-child" typeForCss="computer-tower">
                    🖥️ Bilgisayar Kasası
                </DraggableSidebarItem>
                <DraggableSidebarItem id="keyboard" type="static-child" typeForCss="keyboard">
                    🖥️ Klavye
                </DraggableSidebarItem>
            </div>

            {/* DUVAR — sadece bir tane, rotate ile yön değiştirilebilir */}
            <div className="sidebar-section">
                <h4>🧱 DUVAR</h4>
                <DraggableSidebarItem id="wall" type="wall-item" typeForCss="wall">
                    🧱 Duvar
                </DraggableSidebarItem>
            </div>
        </div>
    );
};

export default Sidebar;