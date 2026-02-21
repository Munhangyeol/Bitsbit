import { useMemo } from 'react';

/**
 * localStorage에서 브라우저별 고유 세션 ID를 반환.
 * 없으면 새로 생성 후 저장.
 */
export function useSessionId() {
  return useMemo(() => {
    let id = localStorage.getItem('crypto_session_id');
    if (!id) {
      id = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('crypto_session_id', id);
    }
    return id;
  }, []);
}
