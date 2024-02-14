import { useState, useEffect, useCallback } from 'react';

/**
 * Benutzt Local Storage, um einen State zu speichern und zu verwalten.
 *
 * @export
 * @param {string} key - Der Schlüssel, unter dem der Wert im Local Storage gespeichert wird.
 * @param {*} defaultValue - Der Standardwert, der verwendet wird, falls kein Wert im Local Storage vorhanden ist.
 * @returns Ein Array mit dem State-Wert, einer Setter-Funktion und einer Funktion zum Entfernen des Werts.
 */
export function useLocalStorage(key, defaultValue) {
  return useStorage(key, defaultValue, window.localStorage)
}

/**
 * Benutzt Session Storage, um einen State zu speichern und zu verwalten.
 *
 * @export
 * @param {string} key - Der Schlüssel, unter dem der Wert im Session Storage gespeichert wird.
 * @param {*} defaultValue - Der Standardwert, der verwendet wird, falls kein Wert im Session Storage vorhanden ist.
 * @returns Ein Array mit dem State-Wert, einer Setter-Funktion und einer Funktion zum Entfernen des Werts.
 */
export function useSessionStorage(key, defaultValue) {
  return useStorage(key, defaultValue, window.sessionStorage)
}

/**
 * Interne Funktion zur Verwaltung von Storage (Local oder Session).
 *
 * @param {string} key - Der Schlüssel für den Storage-Eintrag.
 * @param {*} defaultValue - Standardwert, falls kein Eintrag existiert.
 * @param {Storage} storageObject - Das Storage-Objekt (Local oder Session Storage).
 * @returns Ein Array mit dem State-Wert, einer Setter-Funktion und einer Funktion zum Entfernen des Werts.
 */
function useStorage(key, defaultValue, storageObject) {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key)
    if (jsonValue != null) return JSON.parse(jsonValue)

    if (typeof defaultValue === "function") {
      return defaultValue()
    } else {
      return defaultValue
    }
  })

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    
    storageObject.setItem(key, JSON.stringify(value))
  }, [key, value, storageObject])

  const remove = useCallback(() => {
    setValue(undefined)
  }, [])

  return [value, setValue, remove]
}
