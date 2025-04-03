import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { DatabaseService } from '../database/platformAdapter';
import { SyncService } from '../services/syncService';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  const handleEndDay = async () => {
    try {
      // Get active point if exists
      const activePonto = await DatabaseService.getPontoAtivo('161217'); // Using mock driver ID
      
      if (activePonto) {
        // Finalize active point
        await DatabaseService.finalizarPonto(activePonto.id);
      }

      // Force sync to ensure all data is sent to server
      await SyncService.forceSyncNow();

      // Navigate back to login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error ending day:', error);
      Alert.alert('Erro', 'Não foi possível encerrar a jornada.');
    }
  };

  return (
    <View style={styles.container}>
      <Button 
        mode="contained" 
        onPress={handleEndDay}
        style={styles.button}
        labelStyle={styles.buttonText}
      >
        ENCERRAR JORNADA DO DIA
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Footer;
