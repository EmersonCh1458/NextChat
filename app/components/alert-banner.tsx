'use client';

import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import styles from './alert-banner.module.scss';

export default function AlertBanner() {
  const [show, setShow] = useState(false);
  const [cookies, setCookie] = useCookies(['alertDismissed']);
  
  useEffect(() => {
    // 检查cookie是否已设置7天内不显示
    if (!cookies.alertDismissed) {
      setShow(true);
    }
  }, [cookies.alertDismissed]);

  const handleDismiss = (days = 0) => {
    if (days > 0) {
      // 设置7天内不显示的cookie
      const expires = new Date();
      expires.setDate(expires.getDate() + days);
      setCookie('alertDismissed', 'true', { path: '/', expires });
    }
    setShow(false);
  };

  if (!show || !process.env.NEXT_PUBLIC_ALERT_MESSAGE) return null;

  return (
    <div className={styles.alertOverlay}>
      <div className={styles.alertBox}>
        <div className={styles.alertContent}>
          {process.env.NEXT_PUBLIC_ALERT_MESSAGE}
        </div>
        <div className={styles.alertActions}>
          <button 
            className={styles.alertButton}
            onClick={() => handleDismiss(0)}
          >
            确定
          </button>
          <button 
            className={styles.alertButton}
            onClick={() => handleDismiss(7)}
          >
            确定且七天内不显示
          </button>
        </div>
      </div>
    </div>
  );
}
