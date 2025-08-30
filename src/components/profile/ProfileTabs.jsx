import React, { useState, useId, useRef, useEffect } from 'react';

const ProfileTabs = ({ tabs, onTabClick }) => {
  const [active, setActive] = useState(0);
  const tablistId = useId();
  const buttonsRef = useRef([]);

  useEffect(() => {
    buttonsRef.current[active]?.focus();
  }, [active]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') setActive((active + 1) % tabs.length);
    if (e.key === 'ArrowLeft') setActive((active - 1 + tabs.length) % tabs.length);
    if (e.key === 'Home') setActive(0);
    if (e.key === 'End') setActive(tabs.length - 1);
  };

  return (
    <div className="profile-tabs">
      <div role="tablist" aria-label="Seções do perfil" id={tablistId} className="tablist">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            id={`${tablistId}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${tablistId}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            className={`tab-button ${active === i ? 'active' : ''}`}
            onKeyDown={onKeyDown}
            onClick={() => {
              if (onTabClick && onTabClick(i, tabs[i])) return;
              setActive(i);
            }}
            ref={el => buttonsRef.current[i] = el}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${tablistId}-panel-${i}`}
          aria-labelledby={`${tablistId}-tab-${i}`}
          hidden={active !== i}
          className="tab-panel"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
};

export default ProfileTabs;


