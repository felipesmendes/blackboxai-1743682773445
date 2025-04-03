import { Platform } from 'react-native';
import webStorage from './webStorage';

// Create a wrapper to ensure storage is initialized
class StorageWrapper {
  constructor(storage) {
    this.storage = storage;
    this.initialized = false;
    this.initPromise = null;
  }

  async ensureInitialized() {
    if (this.initialized) return;
    if (!this.initPromise) {
      this.initPromise = this.storage.initStorage();
    }
    await this.initPromise;
    this.initialized = true;
  }

  async createPonto(...args) {
    await this.ensureInitialized();
    return this.storage.createPonto(...args);
  }

  async getPontosMotorista(...args) {
    await this.ensureInitialized();
    return this.storage.getPontosMotorista(...args);
  }

  async getPontoAtivo(...args) {
    await this.ensureInitialized();
    return this.storage.getPontoAtivo(...args);
  }

  async finalizarPonto(...args) {
    await this.ensureInitialized();
    return this.storage.finalizarPonto(...args);
  }

  async getUnsyncedPontos(...args) {
    await this.ensureInitialized();
    return this.storage.getUnsyncedPontos(...args);
  }

  async markAsSynced(...args) {
    await this.ensureInitialized();
    return this.storage.markAsSynced(...args);
  }
}

// Export the appropriate storage adapter based on platform
export const DatabaseService = Platform.select({
  web: new StorageWrapper(webStorage),
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