import { useEffect, useRef } from 'react';

/**
 * 지정한 콜백을 intervalMs마다 반복 실행.
 * 컴포넌트 언마운트 시 자동으로 interval을 정리해 메모리 누수를 방지.
 *
 * @param {Function} callback - 반복 실행할 함수
 * @param {number} intervalMs - 실행 간격 (밀리초)
 */
export function useAutoRefresh(callback, intervalMs) {
  const callbackRef = useRef(callback);

  // 최신 콜백 참조 유지 (stale closure 방지)
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setInterval(() => {
      callbackRef.current();
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);
}
