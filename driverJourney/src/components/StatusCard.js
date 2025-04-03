import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Card } from 'react-native-paper';
import Timer from './Timer';

const StatusCard = ({ title, icon, isActive, onPress, elapsedTime }) => {
  return (
    <Card style={[styles.card, isActive && styles.activeCard]}>
      <Card.Content style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.icon}>{icon}</Text>
        <Timer time={elapsedTime} />
        <Button
          mode="contained"
          onPress={onPress}
          style={[
            styles.button,
            isActive ? styles.activeButton : styles.inactiveButton,
          ]}
        >
          {isActive ? 'ATIVO' : 'INICIAR'}
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    flex: 1,
    minHeight: 180,
  },
  activeCard: {
    borderColor: '#0066cc',
    borderWidth: 2,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    fontSize: 24,
    marginVertical: 8,
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
  activeButton: {
    backgroundColor: '#0066cc',
  },
  inactiveButton: {
    backgroundColor: '#666',
  },
});

export default StatusCard;