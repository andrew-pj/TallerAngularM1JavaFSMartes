import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { TarjetaMascota } from '../../components/tarjeta-mascota/tarjeta-mascota';
import { Mascota } from '../../models/mascota';
import { MascotasApi } from '../../services/mascotas-api';
import { FavoritosStore } from '../../services/favoritos-store';
import { mensajeDeError } from '../../shared/mensaje-error';

@Component({
  imports: [TarjetaMascota],
  selector: 'app-listado-mascotas',
  styleUrl: './listado-mascotas.css',
  templateUrl: './listado-mascotas.html',
})
export class ListadoMascotas {
  private readonly api = inject(MascotasApi);
  readonly favoritos = inject(FavoritosStore);

  readonly busqueda = signal('');
  readonly soloDisponibles = signal(false);
  readonly mascotas = signal<Mascota[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  readonly mascotasFiltradas = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    return this.mascotas().filter((mascota) => {
      const coincide = !texto || mascota.nombre.toLowerCase().includes(texto);
      const disponible = !this.soloDisponibles() || !mascota.adoptada;
      return coincide && disponible;
    });
  });

  constructor() {
    this.api.listar().subscribe({
      next: (mascotas) => {
        this.mascotas.set(mascotas);
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(mensajeDeError(error));
        this.cargando.set(false);
      },
    });
  }

  alBuscar(evento: Event): void {
    this.busqueda.set((evento.target as HTMLInputElement).value);
  }

  alCambiarDisponibles(evento: Event): void {
    this.soloDisponibles.set((evento.target as HTMLInputElement).checked);
  }

  alternarFavorito(id: number): void {
    this.favoritos.alternar(id);
  }
}
