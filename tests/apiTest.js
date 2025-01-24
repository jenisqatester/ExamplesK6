import http from 'k6/http';
import { check, group } from 'k6';

const config = JSON.parse(open('../config.json')); // Cargar configuración desde el archivo

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1, // Smoke test utiliza un usuario virtual
      duration: '30s', // Ejecuta la prueba por 30 segundos
    },
  },
};

export default function () {
  group('Prueba de API y validación de JSON', () => {
    const apiUrl = config.API_BASE_URL; // Leer la URL desde el archivo de configuración

    const response = http.get(apiUrl);

    check(response, {
      'Estado HTTP es 200': (r) => r.status === 200,
      'El JSON contiene la propiedad "title" con el valor esperado': (r) => {
        const body = JSON.parse(r.body);
        return body.title === 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit';
      },
    });
  });
}

