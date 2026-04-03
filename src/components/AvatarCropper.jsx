import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

const AvatarCropper = ({ imageSrc, onCancel, onSave }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0); // 👈 NEW: Rotation state
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            // Note: getCroppedImg needs to be updated to handle rotation if you want the final crop to be rotated
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
            onSave(croppedImage); 
        } catch (e) {
            console.error("Cropping failed", e);
        }
    };

    const handleReset = () => {
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setRotation(0);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: '#000', 
            zIndex: 9999999, 
            display: 'flex', flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px calc(20px + env(safe-area-inset-right)) 20px calc(20px + env(safe-area-inset-left))', zIndex: 10, paddingTop: 'calc(20px + env(safe-area-inset-top))' }}>
                <button onClick={onCancel} style={{ background: 'none', color: '#fff', fontSize: '1.1rem', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleReset} style={{ background: 'none', color: '#888', fontSize: '1rem', cursor: 'pointer' }}><i className="fa-solid fa-rotate-left"></i> Reset</button>
                <button onClick={handleSave} style={{ background: 'none', color: '#a855f7', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>Save</button>
            </div>

            {/* Cropper Area */}
            <div style={{ position: 'relative', flex: 1 }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation} // 👈 NEW: Pass rotation
                    aspect={1}
                    cropShape="round"
                    showGrid={true} // 👈 CHANGED: Turned on the grid!
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    onRotationChange={setRotation}
                />
            </div>

            {/* Controls (Bottom) */}
            <div style={{ 
                padding: '20px 20px calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 20px) + 20px)', 
                background: '#111', 
                zIndex: 10, 
                display: 'flex', 
                flexDirection: 'column',
                gap: '20px' 
            }}>
                
                {/* Drag Hint & Rotate Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>Drag to adjust</span>
                    <button 
                        onClick={() => setRotation(rotation + 90)} 
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                        <i className="fa-solid fa-rotate-right"></i> Rotate
                    </button>
                </div>

                {/* Zoom Slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <i className="fa-solid fa-image" style={{ color: '#888', fontSize: '0.9rem' }}></i>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(e.target.value)}
                        style={{ flex: 1, accentColor: '#a855f7' }}
                    />
                    <i className="fa-solid fa-image" style={{ color: '#fff', fontSize: '1.2rem' }}></i>
                </div>
            </div>
        </div>
    );
};

export default AvatarCropper;