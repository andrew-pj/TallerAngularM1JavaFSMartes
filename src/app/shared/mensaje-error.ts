import { HttpErrorResponse } from '@angular/common/http';

export function mensajeDeError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No pudimos conectar con el servidor. Intenta más tarde.';
  }
  if (error.status === 404) {
    return 'No encontramos lo que buscas.';
  }
  if (error.status >= 500) {
    return 'Tuvimos un problema en el servidor. Intenta más tarde.';
  }
  return `Ocurrió un error (código ${error.status}).`;
}
