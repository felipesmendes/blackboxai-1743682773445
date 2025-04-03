import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Surface } from 'react-native-paper';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StatusGrid from '../components/StatusGrid';
import Timer from '../components/Timer';
import { StorageService } from '../services/storageService';

const HomeScreen = () => {
  const [totalTime, setTotalTime] = useState(0);
  const [activeTime, setActiveTime] = useState(0);
  const [journeyStartTime, setJourneyStartTime] = useState(null);

  useEffect(() => {
    loadJourneyData();
    startTimers();
  }, []);

  const loadJourneyData = async () => {
    try {
      const history = await StorageService.getPointsHistory();
      if (history.length > 0) {
        // Get the earliest point as journey start
        const startTime = new Date(Math.min(...history.map(p => new Date(p.data_hora))));
        setJourneyStartTime(startTime);
        
        // Calculate total active time from completed points
        const completedTime = history
          .filter(p => p.data_hora_fim)
          .reduce((total, p) => total + p.tempo, 0);
        setActiveTime(completedTime);
      } else {
        // If no history, start journey now
        setJourneyStartTime(new Date());
      }
    } catch (error) {
      console.error('Error loading journey data:', error);
    }
  };

  const startTimers = () => {
    // Update total journey time every second
    const interval = setInterval(() => {
      if (journeyStartTime) {
        const totalSeconds = Math.floor((new Date() - journeyStartTime) / 1000);
        setTotalTime(totalSeconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <Surface style={styles.banner}>
          <View style={styles.statusIndicator}>
            <Text style={styles.title}>Jornada em Andamento</Text>
            <View style={styles.dot} />
          </View>
          <View style={styles.timers}>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Horas trabalhando:</Text>
              <Timer time={activeTime} />
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>Horas totais:</Text>
              <Timer time={totalTime} />
            </View>
          </View>
        </Surface>
        <StatusGrid />
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  banner: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  timers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});

export default HomeScreen;