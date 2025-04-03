import React from 'react';
import { StyleSheet, Text } from 'react-native';

const Timer = ({ time = 0 }) => {
  // Convert seconds to HH:MM:SS format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const pad = (num) => num.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  };

  return (
    <Text style={styles.timer}>
      {formatTime(time)}
    </Text>
  );
};

const styles = StyleSheet.create({
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginVertical: 8,
  },
});

export default Timer;