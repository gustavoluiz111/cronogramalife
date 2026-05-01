import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { ref, set, onValue } from 'firebase/database';
import { useAuth } from '../contexts/AuthContext';

/**
 * useFirebaseData — salva estado apenas na nuvem (Firebase Realtime Database).
 * Substitui o antigo useLocalStorage para garantir que tudo seja acessível de qualquer dispositivo.
 */
export function useFirebaseData(key, defaultValue) {
  const { currentUser } = useAuth();
  
  const [value, setValue] = useState(() => {
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  });
  
  const [isLoading, setIsLoading] = useState(true);

  const fromFirebase  = useRef(false);
  const isMounted     = useRef(false);
  const writeTimeout  = useRef(null);

  // ── Subscribe to Firebase Realtime Database ───────────────────────────────
  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const safePath = key.replace(/\./g, '_');
    const dbRef    = ref(db, `users/${currentUser.uid}/app_data/${safePath}`);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          fromFirebase.current = true;
          setValue(snapshot.val());
        }
        setIsLoading(false);
      },
      (error) => {
        console.warn(`[Firebase] Leitura falhou para "${key}":`, error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [key, currentUser]);

  // ── Write to Firebase when value changes locally ───────────
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (fromFirebase.current) {
      fromFirebase.current = false;
      return;
    }

    if (!currentUser || isLoading) return;

    clearTimeout(writeTimeout.current);
    writeTimeout.current = setTimeout(() => {
      const safePath = key.replace(/\./g, '_');
      const dbRef    = ref(db, `users/${currentUser.uid}/app_data/${safePath}`);
      set(dbRef, value).catch(err => {
        console.warn(`[Firebase] Escrita falhou para "${key}":`, err.message);
      });
    }, 1000);

    return () => clearTimeout(writeTimeout.current);
  }, [key, value, currentUser, isLoading]);

  // Retorna isLoading como 3º item, caso componentes precisem saber se os dados já vieram da nuvem
  return [value, setValue, isLoading];
}
