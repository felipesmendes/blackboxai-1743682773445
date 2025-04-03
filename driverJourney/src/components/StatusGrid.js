import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import StatusCard from './StatusCard';
import { StorageService } from '../services/storageService';

const STATUS_TYPES = [
  { id: 'refeicao', title: 'Refeição', icon: '🍛' },
  { id: 'conducao', title: 'Condução', icon: '🚛' },
  { id: 'disponivel', title: 'Disponível', icon: '👨‍🔧' },
  { id: 'espera', title: 'Em Espera', icon: '⏳' },
  { id: 'descanso', title: 'Descanso', icon: '☕' },
  { id: 'eventos', title: 'Eventos', icon: '📅' },
];

const MOCK_DRIVER_ID = '161217'; // Mock driver ID
const MOCK_VEHICLE_ID = 'VEH001'; // Mock vehicle ID

const StatusGrid = () => {
  const [activeStatus, setActiveStatus] = useState(null);
  const [activePonto, setActivePonto] = useState(null);
  const [timers, setTimers] = useState({});

  // Load active status on component mount
  useEffect(() => {
    loadActiveStatus();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (activeStatus) {
      interval = setInterval(() => {
        setTimers(prev => ({
          ...prev,
          [activeStatus]: (prev[activeStatus] || 0) + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeStatus]);

  const loadActiveStatus = async () => {
    try {
      const ponto = await StorageService.getPontoAtivo(MOCK_DRIVER_ID);
      if (ponto) {
        setActiveStatus(ponto.tipo);
        setActivePonto(ponto);
        // Calculate elapsed time
        const elapsedSeconds = Math.floor((Date.now() - new Date(ponto.data_hora)) / 1000);
        setTimers(prev => ({
          ...prev,
          [ponto.tipo]: elapsedSeconds
        }));
      }
    } catch (error) {
      console.error('Error loading active status:', error);
      Alert.alert('Erro', 'Não foi possível carregar o status ativo.');
    }
  };

  const handleStatusPress = async (statusId) => {
    try {
      if (activeStatus === statusId) {
        // Deactivate current status
        if (activePonto) {
          await StorageService.finalizarPonto(activePonto.id);
        }
        setActiveStatus(null);
        setActivePonto(null);
      } else {
        // Finalize current status if exists
        if (activePonto) {
          await StorageService.finalizarPonto(activePonto.id);
        }

        // Start new status
        const newPonto = await StorageService.createPonto(
          MOCK_DRIVER_ID,
          MOCK_VEHICLE_ID,
          statusId
        );
        setActiveStatus(statusId);
        setActivePonto(newPonto);
        setTimers(prev => ({
          ...prev,
          [statusId]: 0
        }));
      }
    } catch (error) {
      console.error('Error handling status change:', error);
      Alert.alert('Erro', 'Não foi possível alterar o status.');
    }
  };

  return (
    <View style={styles.container}>
      {STATUS_TYPES.map((status) => (
        <View key={status.id} style={styles.cardContainer}>
          <StatusCard
            title={status.title}
            icon={status.icon}
            isActive={activeStatus === status.id}
            onPress={() => handleStatusPress(status.id)}
            elapsedTime={timers[status.id] || 0}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 8,
  },
  cardContainer: {
    width: '50%',
    padding: 4,
  },
});

export default StatusGrid;