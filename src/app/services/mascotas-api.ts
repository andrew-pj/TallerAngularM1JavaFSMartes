import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Mascota } from '../models/mascota';
import { SolicitudAdopcion } from '../models/solicitud-adopcion';

@Service()
export class MascotasApi {
  private readonly http = inject(HttpClient);

  listar() {
    return this.http.get<Mascota[]>('/api/mascotas');
  }

  obtener(id: number) {
    return this.http.get<Mascota>(`/api/mascotas/${id}`);
  }

  enviarSolicitud(solicitud: SolicitudAdopcion) {
    return this.http.post('/api/solicitudes', solicitud);
  }
}
