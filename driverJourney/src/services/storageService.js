// Storage keys
const KEYS = {
  ACTIVE_POINT: 'activePoint',
  POINTS_HISTORY: 'pointsHistory',
};

export const StorageService = {
  // Create a new journey point
  async createPonto(motorista_id, veiculo_id, tipo) {
    const ponto = {
      id: Date.now().toString(),
      motorista_id,
      veiculo_id,
      tipo,
      data_hora: new Date(),
      data_hora_fim: null,
      tempo: 0,
    };

    // Save as active point
    await this.setActivePoint(ponto);

    // Add to history
    const history = await this.getPointsHistory();
    history.push(ponto);
    await this.setPointsHistory(history);

    return ponto;
  },

  // Get all points for a driver
  async getPontosMotorista(motorista_id) {
    const history = await this.getPointsHistory();
    return history.filter(point => point.motorista_id === motorista_id);
  },

  // Get active point
  async getPontoAtivo(motorista_id) {
    const activePoint = await this.getActivePoint();
    if (activePoint && activePoint.motorista_id === motorista_id) {
      return activePoint;
    }
    return null;
  },

  // Finalize a point
  async finalizarPonto(ponto_id) {
    const activePoint = await this.getActivePoint();
    if (activePoint && activePoint.id === ponto_id) {
      const endTime = new Date();
      const updatedPoint = {
        ...activePoint,
        data_hora_fim: endTime,
        tempo: Math.floor((endTime - new Date(activePoint.data_hora)) / 1000),
      };

      // Update in history
      const history = await this.getPointsHistory();
      const index = history.findIndex(p => p.id === ponto_id);
      if (index !== -1) {
        history[index] = updatedPoint;
        await this.setPointsHistory(history);
      }

      // Clear active point
      await this.setActivePoint(null);
      return true;
    }
    return false;
  },

  // Helper methods for localStorage
  async getActivePoint() {
    try {
      const point = localStorage.getItem(KEYS.ACTIVE_POINT);
      return point ? JSON.parse(point) : null;
    } catch (error) {
      console.error('Error getting active point:', error);
      return null;
    }
  },

  async setActivePoint(point) {
    try {
      if (point) {
        localStorage.setItem(KEYS.ACTIVE_POINT, JSON.stringify(point));
      } else {
        localStorage.removeItem(KEYS.ACTIVE_POINT);
      }
    } catch (error) {
      console.error('Error setting active point:', error);
    }
  },

  async getPointsHistory() {
    try {
      const history = localStorage.getItem(KEYS.POINTS_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting points history:', error);
      return [];
    }
  },

  async setPointsHistory(history) {
    try {
      localStorage.setItem(KEYS.POINTS_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Error setting points history:', error);
    }
  },
};

export default StorageService;