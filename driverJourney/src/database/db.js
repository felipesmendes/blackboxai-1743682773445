import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import Ponto from './models/Ponto';

// Initialize SQLite adapter
const adapter = new SQLiteAdapter({
  schema,
  // Optional database name
  dbName: 'driverJourneyDB',
  // Optional migrations
  migrations: [],
  // Optional logging
  onSetUpError: error => {
    console.error('Failed to set up database:', error);
  },
});

// Initialize database with the adapter
const database = new Database({
  adapter,
  modelClasses: [
    Ponto,
  ],
});

export default database;

// Helper functions for database operations
export const DatabaseService = {
  // Create a new journey point
  async createPonto(motorista_id, veiculo_id, tipo) {
    return await Ponto.createPonto(database, {
      motorista_id,
      veiculo_id,
      tipo,
    });
  },

  // Get all points for a driver
  async getPontosMotorista(motorista_id) {
    return await database
      .get('pontos')
      .query()
      .where('motorista_id', motorista_id)
      .fetch();
  },

  // Get active point
  async getPontoAtivo(motorista_id) {
    return await database
      .get('pontos')
      .query()
      .where('motorista_id', motorista_id)
      .where('data_hora_fim', null)
      .fetchOne();
  },

  // Finalize a point
  async finalizarPonto(ponto_id) {
    const ponto = await database.get('pontos').find(ponto_id);
    if (ponto) {
      await ponto.finalizarPonto();
      return true;
    }
    return false;
  },

  // Get all unsynced points
  async getUnsyncedPontos() {
    return await database
      .get('pontos')
      .query()
      .where('synced', false)
      .fetch();
  },

  // Mark points as synced
  async markAsSynced(pontos) {
    await database.write(async () => {
      await Promise.all(
        pontos.map(ponto =>
          ponto.update(p => {
            p.synced = true;
          })
        )
      );
    });
  },
};