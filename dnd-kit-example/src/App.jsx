// App.jsx (Tek dosya içinde tam örnek)

import React, { useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import {Draggable} from "./component/Draggable.jsx";
import { createSnapToGridModifier } from './util/snapToGridModifier.js'; // Bu dosyayı oluşturduğunuzu varsayıyorum

function App() {
    const gridSize = 20;
    const snapToGridModifier = createSnapToGridModifier(gridSize);

    // Sürüklenebilir elemanın pozisyonunu saklamak için bir state
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

    function handleDragEnd(event) {
        const { delta } = event; // Sürüklenmenin ne kadar yapıldığını alıyoruz

        // Yeni pozisyonu hesapla ve state'i güncelle
        // setCoordinates(({ x, y }) => {
        //     // Izgaraya yaslanmış son pozisyonu hesapla
        //     const newX = Math.round((x + delta.transform.x) / gridSize) * gridSize;
        //     const newY = Math.round((y + delta.transform.y) / gridSize) * gridSize;
        //     return { x: newX, y: newY };
        // });

        setCoordinates(({ x, y }) => {
            console.log(delta);
            const newX = x + delta.x;
            const newY = y + delta.y;

            // Yeni pozisyonu en yakın ızgara noktasına yuvarla
            const snappedX = Math.round(newX / gridSize) * gridSize;
            const snappedY = Math.round(newY / gridSize) * gridSize;

            return { x: snappedX, y: snappedY };
        });
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div
                style={{
                    height: '100vh',
                    width: '100%',
                    position: 'relative',
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
                    backgroundSize: `${gridSize}px ${gridSize}px`,
                }}
            >
                <Draggable id="draggable-1" coordinates={coordinates}>
                    <div style={{
                        width: 100,
                        height: 100,
                        backgroundColor: 'royalblue',
                        borderRadius: '8px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'grab',
                        position: 'absolute', // Pozisyonu yönetmek için
                        top: 0,
                        left: 0
                    }}>
                        Beni Sürükle
                    </div>
                </Draggable>
            </div>
        </DndContext>
    );
}

export default App;