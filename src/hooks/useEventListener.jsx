import { useEffect, useRef } from 'react';

/**
 * Event-Listener für ein spezifiziertes Element hinzufügen
 * Der Listener wird entfernt, wenn die Komponente unmountet oder die Abhängigkeiten sich ändern.
 *
 * @export
 * @param {string} eventType - Der Typ des Events, auf das gehört werden soll (z.B. 'click', 'resize').
 * @param {Function} callback - Die Callback-Funktion, die bei Auslösung des Events aufgerufen wird.
 * @param {Window|HTMLElement} [element=window] - Das Element, an das der Event-Listener angehängt wird. Standardmäßig `window`.
 */
export default function useEventListener(eventType, callback, element = window) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (element == null) return

    const handler = e => callbackRef.current(e)
    element.addEventListener(eventType, handler)

    return () => element.removeEventListener(eventType, handler)
  }, [eventType, element])
}
