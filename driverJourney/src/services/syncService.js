import { DatabaseService } from '../database/platformAdapter';

const API_BASE_URL = 'https://api.example.com'; // Replace with actual API URL

export const SyncService = {
  // Sync all pending records to the server
  async syncPendingRecords() {
    try {
      // Get all unsynced records
      const unsyncedPontos = await DatabaseService.getUnsyncedPontos();

      if (unsyncedPontos.length === 0) {
        console.log('No records to sync');
        return;
      }

      // Prepare the records for sync
      const recordsToSync = unsyncedPontos.map(ponto => ({
        id: ponto.id,
        motorista_id: ponto.motorista_id,
        veiculo_id: ponto.veiculo_id,
        data_hora: ponto.data_hora.toISOString(),
        data_hora_fim: ponto.data_hora_fim?.toISOString(),
        tempo: ponto.tempo,
        tipo: ponto.tipo,
      }));

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
      await DatabaseService.markAsSynced(unsyncedPontos);

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