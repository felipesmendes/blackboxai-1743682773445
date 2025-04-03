import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  POINTS: 'driverJourney_points',
};

class WebStorageAdapter {
  constructor() {
    // Initialize storage if needed
    this.initStorage();
  }

  async initStorage() {
    try {
      const points = await AsyncStorage.getItem(STORAGE_KEYS.POINTS);
      if (!points) {
        await AsyncStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error initializing storage:', error);
    }
  }

  async getPoints() {
    try {
      const points = await AsyncStorage.getItem(STORAGE_KEYS.POINTS);
      return points ? JSON.parse(points) : [];
    } catch (error) {
      console.error('Error getting points:', error);
      return [];
    }
  }

  async savePoints(points) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.POINTS, JSON.stringify(points));
    } catch (error) {
      console.error('Error saving points:', error);
    }
  }

  async createPonto(motorista_id, veiculo_id, tipo) {
    const points = await this.getPoints();
    const newPoint = {
      id: Date.now().toString(),
      motorista_id,
      veiculo_id,
      tipo,
      data_hora: new Date(),
      data_hora_fim: null,
      tempo: 0,
      synced: false,
    };
    points.push(newPoint);
    await this.savePoints(points);
    return newPoint;
  }

  async getPontosMotorista(motorista_id) {
    const points = await this.getPoints();
    return points.filter(point => point.motorista_id === motorista_id);
  }

  async getPontoAtivo(motorista_id) {
    const points = await this.getPoints();
    return points.find(
      point => point.motorista_id === motorista_id && !point.data_hora_fim
    );
  }

  async finalizarPonto(ponto_id) {
    const points = await this.getPoints();
    const index = points.findIndex(point => point.id === ponto_id);
    if (index !== -1) {
      const endTime = new Date();
      points[index] = {
        ...points[index],
        data_hora_fim: endTime,
        tempo: Math.floor((endTime - new Date(points[index].data_hora)) / 1000),
      };
      await this.savePoints(points);
      return true;
    }
    return false;
  }

  async getUnsyncedPontos() {
    const points = await this.getPoints();
    return points.filter(point => !point.synced);
  }

  async markAsSynced(pontos) {
    const points = await this.getPoints();
    const updatedPoints = points.map(point => {
      if (pontos.some(p => p.id === point.id)) {
        return { ...point, synced: true };
      }
      return point;
    });
    await this.savePoints(updatedPoints);
  }
}

export default new WebStorageAdapter();