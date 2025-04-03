import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Ponto extends Model {
  static table = 'pontos';

  @field('motorista_id')
  motorista_id;

  @field('veiculo_id')
  veiculo_id;

  @date('data_hora')
  data_hora;

  @date('data_hora_fim')
  data_hora_fim;

  @field('tempo')
  tempo;

  @field('tipo')
  tipo;

  @readonly
  @date('created_at')
  createdAt;

  @readonly
  @date('updated_at')
  updatedAt;

  // Helper methods
  async finalizarPonto() {
    const now = new Date();
    await this.update(ponto => {
      ponto.data_hora_fim = now;
      ponto.tempo = Math.floor((now - this.data_hora) / 1000); // tempo em segundos
    });
  }

  static async createPonto(database, { motorista_id, veiculo_id, tipo }) {
    return await database.write(async () => {
      return await database.get('pontos').create(ponto => {
        ponto.motorista_id = motorista_id;
        ponto.veiculo_id = veiculo_id;
        ponto.data_hora = new Date();
        ponto.tipo = tipo;
        ponto.tempo = 0;
      });
    });
  }
}