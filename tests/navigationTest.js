import http from 'k6/http';
import { check, group } from 'k6';

const config = JSON.parse(open('../config.json')); // Cargar configuración desde el archivo

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
    },
  },
};

export default function () {
  const baseUrl = config.WEB_BASE_URL; // Leer la URL desde el archivo de configuración

  group('Verificación de navegación y contenido de la página', () => {
    const res = http.get(baseUrl);

    check(res, {
      'Estado HTTP es 200': (r) => r.status === 200,
      'El encabezado contiene el texto esperado': (r) =>
        r.body.includes('<h1>JSONPlaceholder</h1>'),
    });
  });
}

