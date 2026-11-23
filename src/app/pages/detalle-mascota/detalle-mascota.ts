import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TarjetaMascota } from '../../components/tarjeta-mascota/tarjeta-mascota';
import { Mascota } from '../../models/mascota';
import { SolicitudAdopcion } from '../../models/solicitud-adopcion';
import { MascotasApi } from '../../services/mascotas-api';
import { FavoritosStore } from '../../services/favoritos-store';
import { mensajeDeError } from '../../shared/mensaje-error';

@Component({
  imports: [RouterLink, TarjetaMascota],
  selector: 'app-detalle-mascota',
  styleUrl: './detalle-mascota.css',
  templateUrl: './detalle-mascota.html',
})
export class DetalleMascota implements OnInit {
  id = input.required<string>();

  private readonly api = inject(MascotasApi);
  readonly favoritos = inject(FavoritosStore);

  readonly mascota = signal<Mascota | null>(null);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly noEncontrada = signal(false);

  readonly nombre = signal('');
  readonly correo = signal('');
  readonly motivo = signal('');
  readonly enviando = signal(false);
  readonly solicitudExitosa = signal(false);
  readonly errorSolicitud = signal('');

  readonly formularioValido = computed(() =>
    [this.nombre(), this.correo(), this.motivo()].every((valor) => valor.trim().length > 0),
  );

  ngOnInit(): void {
    this.api.obtener(Number(this.id())).subscribe({
      next: (mascota) => {
        this.mascota.set(mascota);
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        if (error.status === 404) {
          this.noEncontrada.set(true);
        } else {
          this.error.set(mensajeDeError(error));
        }
      },
    });
  }

  alEscribir(campo: 'nombre' | 'correo' | 'motivo', evento: Event): void {
    const valor = (evento.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (campo === 'nombre') this.nombre.set(valor);
    if (campo === 'correo') this.correo.set(valor);
    if (campo === 'motivo') this.motivo.set(valor);
  }

  alternarFavorito(id: number): void {
    this.favoritos.alternar(id);
  }

  enviarSolicitud(evento: Event): void {
    evento.preventDefault();
    const mascota = this.mascota();
    if (!mascota || !this.formularioValido() || this.enviando()) return;

    const solicitud: SolicitudAdopcion = {
      mascotaId: mascota.id,
      nombreCompleto: this.nombre().trim(),
      correo: this.correo().trim(),
      motivo: this.motivo().trim(),
    };

    this.enviando.set(true);
    this.api.enviarSolicitud(solicitud).subscribe({
      next: () => {
        this.solicitudExitosa.set(true);
        this.enviando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorSolicitud.set(mensajeDeError(error));
        this.enviando.set(false);
      },
    });
  }
}
