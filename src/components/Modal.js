import React from 'react';
import { X } from 'lucide-react';
import '../styles/Browser.css';

const Modal = ({ isOpen, onClose, title, icon: Icon, children, footer, width = 'auto' }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ width }}>
                <div className="modal-header">
                    <div className="modal-title">
                        {Icon && <Icon size={20} />}
                        <h2>{title}</h2>
                    </div>
                    <button className="icon-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {children}

                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
