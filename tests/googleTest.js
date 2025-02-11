import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  // URL de Google definida como variable de entorno
  const googleUrl = __ENV.GOOGLE_URL || 'https://www.google.com';

  // Hacer una solicitud a Google
  let res = http.get(googleUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
  });

  check(res, {
    'Google cargó correctamente': (r) => r.status === 200,
  });

  sleep(2); // Espera de 2 segundos para simular `cy.wait(2000)`

  // Buscar la URL dentro del texto de la página
  const bodyText = res.body;
  const urlMatch = bodyText.match(/URL:\s(https?:\/\/[^\s]+)/);

  if (urlMatch && urlMatch[1]) {
    const extractedURL = urlMatch[1].trim();
    console.log(`URL extraída: ${extractedURL}`);

    sleep(3); // Simula un `cy.wait(3000)`

    // Visitar la URL extraída
    let extractedRes = http.get(extractedURL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    check(extractedRes, {
      'La URL extraída cargó correctamente': (r) => r.status === 200,
    });

    sleep(3); // Espera final
  } else {
    console.error('No se encontró la URL en la respuesta.');
  }
}
