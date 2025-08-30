import React, { useEffect, useRef } from 'react';
import ProfileDashboard from './ProfileDashboard';

const ProfileDashboardModal = ({ isOpen, onClose, userId }) => {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Efeito deve existir sempre; condicionar a lógica ao estado isOpen
  useEffect(() => {
    if (!isOpen) return;

    const prev = document.activeElement;
    closeBtnRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const list = Array.from(focusables || []);
        if (list.length === 0) return;
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      prev?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-modal-title"
        onClick={stop}
        ref={dialogRef}
      >
        <div className="modal-header">
          <h2 id="dashboard-modal-title">Visão Geral</h2>
          <button ref={closeBtnRef} className="modal-close" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>
        <div className="modal-content" role="document">
          <ProfileDashboard userId={userId} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboardModal;


