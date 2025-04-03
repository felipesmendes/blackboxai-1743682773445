import database from '../database/db';

const API_BASE_URL = 'https://api.example.com'; // Replace with actual API URL

export const SyncService = {
  // Sync all pending records to the server
  async syncPendingRecords() {
    try {
      // Get all records that haven't been synced
      const pontos = await database
        .get('pontos')
        .query()
        .fetch();

      // Filter records that need to be synced (you might want to add a 'synced' field to the schema)
      const pendingPontos = pontos.filter(ponto => !ponto.synced);

      // Prepare the records for sync
      const recordsToSync = pendingPontos.map(ponto => ({
        motorista_id: ponto.motorista_id,
        veiculo_id: ponto.veiculo_id,
        data_hora: ponto.data_hora.toISOString(),
        data_hora_fim: ponto.data_hora_fim?.toISOString(),
        tempo: ponto.tempo,
        tipo: ponto.tipo,
      }));

      if (recordsToSync.length === 0) {
        console.log('No records to sync');
        return;
      }

      // Send records to server
      const response = await fetch(`${API_BASE_URL}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pontos: recordsToSync }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync records');
      }

      // Mark records as synced
      await database.write(async () => {
        await Promise.all(
          pendingPontos.map(ponto =>
            ponto.update(p => {
              p.synced = true;
            })
          )
        );
      });

      console.log('Successfully synced records');
    } catch (error) {
      console.error('Error syncing records:', error);
      throw error;
    }
  },

  // Start periodic sync
  startPeriodicSync(intervalMinutes = 5) {
    // Sync immediately
    this.syncPendingRecords();

    // Set up periodic sync
    setInterval(() => {
      this.syncPendingRecords();
    }, intervalMinutes * 60 * 1000);
  },

  // Force immediate sync
  async forceSyncNow() {
    try {
      await this.syncPendingRecords();
      return true;
    } catch (error) {
      console.error('Force sync failed:', error);
      return false;
    }
  },
};

export default SyncService;