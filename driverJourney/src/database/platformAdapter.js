import { Platform } from 'react-native';
import webStorage from './webStorage';

// Export the appropriate storage adapter based on platform
export const DatabaseService = Platform.select({
  web: webStorage,
  default: {
    // Default implementation (could be extended for native platforms)
    createPonto: async () => {
      throw new Error('Not implemented for this platform');
    },
    getPontosMotorista: async () => {
      throw new Error('Not implemented for this platform');
    },
    getPontoAtivo: async () => {
      throw new Error('Not implemented for this platform');
    },
    finalizarPonto: async () => {
      throw new Error('Not implemented for this platform');
    },
    getUnsyncedPontos: async () => {
      throw new Error('Not implemented for this platform');
    },
    markAsSynced: async () => {
      throw new Error('Not implemented for this platform');
    },
  },
});

export default DatabaseService;