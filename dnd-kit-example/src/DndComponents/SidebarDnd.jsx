// src/components/Sidebar.jsx
import React, {useState} from 'react';
import DraggableSidebarItem from './DraggableSidebarItem';
import './Sidebar.css';

const Sidebar = () => {
    // Her bölüm için açık/kapalı durumu
    const [openSections, setOpenSections] = useState({
        furniture: true,        // Varsayılan açık
        materials: false,       // Varsayılan kapalı
        walls: false            // Varsayılan kapalı
    });

    const toggleSection = (sectionKey) => {
        setOpenSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h3>🏗️ Kroki Componentleri</h3>
                <p>Sürükleyip sağdaki alana bırakın.</p>
            </div>

            {/* MOBİLYALAR */}
            <div className="sidebar-section">
                <h4
                    className="section-toggle"
                    onClick={() => toggleSection('furniture')}
                >
                    🪑 MOBİLYALAR {openSections.furniture ? '▲' : '▼'}
                </h4>
                <div className={`section-content ${openSections.furniture ? 'open' : ''}`}>
                    <DraggableSidebarItem id="square-table" type="canvas-item" typeForCss="square">
                        🪑 Kare Masa
                    </DraggableSidebarItem>
                    <DraggableSidebarItem id="l-shaped-table" type="canvas-item" typeForCss="l-shape">
                        🪑 L-Şekilli Masa
                    </DraggableSidebarItem>
                </div>
            </div>

            {/* MALZEMELER */}
            <div className="sidebar-section">
                <h4
                    className="section-toggle"
                    onClick={() => toggleSection('materials')}
                >
                    🖥️ OFİS MALZEMELERİ {openSections.materials ? '▲' : '▼'}
                </h4>
                <div className={`section-content ${openSections.materials ? 'open' : ''}`}>
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
            </div>

            {/* DUVAR */}
            <div className="sidebar-section">
                <h4
                    className="section-toggle"
                    onClick={() => toggleSection('walls')}
                >
                    🧱 DUVAR {openSections.walls ? '▲' : '▼'}
                </h4>
                <div className={`section-content ${openSections.walls ? 'open' : ''}`}>
                    <DraggableSidebarItem id="wall" type="wall-item" typeForCss="wall">
                        🧱 Duvar
                    </DraggableSidebarItem>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;