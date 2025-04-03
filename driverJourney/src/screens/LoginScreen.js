import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { StorageService } from '../services/storageService';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (username === '' || password === '') {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    // Mock credentials
    if (username === 'driver' && password === '1234') {
      try {
        // Clear any existing data
        await StorageService.setActivePoint(null);
        await StorageService.setPointsHistory([]);
        
        // Navigate to home screen
        navigation.navigate('Home');
      } catch (error) {
        console.error('Error during login:', error);
        setError('Erro ao iniciar sessão.');
      }
    } else {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.loginCard}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>Driver Journey</Text>
          <Text style={styles.subtitle}>Controle de Jornada</Text>
        </View>

        <TextInput
          label="Usuário"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button 
          mode="contained" 
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          ENTRAR
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loginCard: {
    padding: 24,
    borderRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: '#B00020',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#0066cc',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;