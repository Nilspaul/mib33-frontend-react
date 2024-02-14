import { useEffect, useRef } from 'react';

/**
 * Custom React-Hook, der einen Callback nach jedem Render außer dem ersten ausführt.
 *
 * @export
 * @param {*} callback - Funktion, die nach dem ersten Render ausgeführt wird.
 * @param {*} depend - Abhängigkeiten, die den Callback auslösen.
 */
export default function useUpdateEffect(callback, depend) {
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    return callback()
  }, depend)
}
