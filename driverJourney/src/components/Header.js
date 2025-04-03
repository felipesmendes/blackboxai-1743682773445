import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { format } from 'date-fns';

const Header = () => {
  const currentDate = format(new Date(), 'eee, dd MMM yyyy');

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{currentDate}</Text>
      <Text style={styles.driverName}>PEDRO HENRIQUE</Text>
      <Text style={styles.registration}>Matrícula: 161217</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  driverName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  registration: {
    fontSize: 16,
  },
});

export default Header;