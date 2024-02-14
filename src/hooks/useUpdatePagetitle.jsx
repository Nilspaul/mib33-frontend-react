import { useEffect } from 'react';

/**
 * Aktualisiert den Browsertitel
 *
 * @export
 * @param {string} pagetitle - Der Titel, der im Dokumenttitel gesetzt werden soll.
 */
export default function useUpdatePagetitle(pagetitle) {
  useEffect(() => {
    document.title = pagetitle;
  });
}