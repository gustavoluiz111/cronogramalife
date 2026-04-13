import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, set, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';

/**
 * useLocalStorage — salva estado no localStorage E sincroniza com Firebase Realtime Database.
 * Agora com suporte multi-usuário (isola os dados por conta).
 */
export function useLocalStorage(key, defaultValue) {
  const { currentUser } = useAuth();
  
  // Lógica local: a chave local pode ter o UID prefixado para não misturar no mesmo PC
  const localKey = currentUser ? `${currentUser.uid}_${key}` : key;

  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(localKey);
      if (saved !== null) return JSON.parse(saved);
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    } catch {
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    }
  });

  const fromFirebase  = useRef(false);
  const isMounted     = useRef(false);
  const writeTimeout  = useRef(null);

  // Mudar valor quando a chave ou o usuário mudar, limpa a tela de resíduos do outro usuário
  useEffect(() => {
    try {
      const saved = localStorage.getItem(localKey);
      if (saved !== null) {
          setValue(JSON.parse(saved));
      } else {
          setValue(typeof defaultValue === 'function' ? defaultValue() : defaultValue);
      }
    } catch { /* ignore */ }
  }, [localKey]);

  // ── Subscribe to Firebase Realtime Database ───────────────────────────────
  useEffect(() => {
    if (!currentUser) return; // Não vincula ao firebase se deslogado

    const safePath = key.replace(/\./g, '_');
    const dbRef    = ref(db, `users/${currentUser.uid}/app_data/${safePath}`);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          fromFirebase.current = true;
          const firebaseVal = snapshot.val();
          setValue(firebaseVal);
          try { localStorage.setItem(localKey, JSON.stringify(firebaseVal)); } catch { /* ignore */ }
        }
      },
      (error) => {
        console.warn(`[Firebase] Leitura falhou para "${key}":`, error.message);
      }
    );

    return () => unsubscribe();
  }, [key, currentUser, localKey]);

  // ── Write to localStorage + Firebase when value changes locally ───────────
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (fromFirebase.current) {
      fromFirebase.current = false;
      return;
    }

    try { localStorage.setItem(localKey, JSON.stringify(value)); } catch { /* ignore */ }

    if (!currentUser) return; // Cancela write online se deslogado

    clearTimeout(writeTimeout.current);
    writeTimeout.current = setTimeout(() => {
      const safePath = key.replace(/\./g, '_');
      const dbRef    = ref(db, `users/${currentUser.uid}/app_data/${safePath}`);
      set(dbRef, value).catch(err => {
        console.warn(`[Firebase] Escrita falhou para "${key}":`, err.message);
      });
    }, 1000);

    return () => clearTimeout(writeTimeout.current);
  }, [key, value, currentUser, localKey]);

  return [value, setValue];
}
