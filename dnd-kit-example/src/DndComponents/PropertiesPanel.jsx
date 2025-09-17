import React from 'react';
import './PropertiesPanel.css';
import {useDispatch, useSelector} from "react-redux";
import {deselectItem, selectSelectedItem} from "./reducers/canvasSlice.jsx";

const PropertiesPanel = () => {
    const dispatch = useDispatch();
    const item = useSelector(selectSelectedItem);

    const onClose = () =>{
        dispatch(deselectItem());
    }

    if (!item) return null;

    const renderProperties = () => {
        switch (item.type) {
            case 'canvas-item':
                return (
                    <>
                        <div className="prop-item">
                            <label>Demirbaş Numarası</label>
                            <span>{item.id}</span>
                        </div>
                        <div className="prop-item">
                            <label>Modül</label>
                            <span>{item.type}</span>
                        </div>
                        <div className="prop-item">
                            <label>Oturan Kişi</label>
                            <input type="text" defaultValue="Selim ALKAN" />
                        </div>
                    </>
                );
            case 'table-items':
                return (
                    <>
                        <div className="prop-item">
                            <label>Stok Numarası</label>
                            <span>{item.id}</span>
                        </div>
                        <div className="prop-item">
                            <label>Zimmetli Kişi</label>
                            <span>Selim</span>
                        </div>
                        <div className="prop-item">
                            <label>Model</label>
                            <span>Curved Ekran</span>
                        </div>
                    </>
                );
            default:
                return <p>Bu nesne tipi için özellik tanımlanmamış.</p>;
        }
    };

    return (
        <div className="properties-panel">
            <div className="panel-header">
                <h3>{item.type} Özellikleri</h3>
                <button onClick={onClose} className="close-btn">&times;</button>
            </div>
            <div className="panel-content">
                {renderProperties()}
            </div>
        </div>
    );
};

export default PropertiesPanel;