import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { UserData } from '../types';
import { generateTokenApi } from '../services/api';
import { saveToken, getToken, removeToken } from '../services/storage';

export const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleCreateToken = async () => {
    if (!email.trim() || !firstName.trim() || !lastName.trim()) {
      Alert.alert('Помилка', 'Заповніть усі поля');
      return;
    }

    setLoading(true);
    try {
      const userData: UserData = {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      };

      const response = await generateTokenApi(userData);
      await saveToken(response.token);
      setToken(response.token);
      Alert.alert('Успіх', 'Токен успішно створено та збережено!');
    } catch (error) {
      Alert.alert('Помилка', 'Не вдалося створити токен');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckSavedToken = async () => {
    const savedToken = await getToken();
    if (savedToken) {
      Alert.alert('Збережений токен', savedToken);
    } else {
      Alert.alert('Інфо', 'Збережений токен відсутній');
    }
  };

  const handleClearToken = async () => {
    await removeToken();
    setToken(null);
    Alert.alert('Успіх', 'Токен видалено з безпечного сховища');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Генерація Токена</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ім'я</Text>
        <TextInput
          style={styles.input}
          placeholder="Тарас"
          value={firstName}
          onChangeText={setFirstName}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Прізвище</Text>
        <TextInput
          style={styles.input}
          placeholder="Шевченко"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreateToken}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Згенерувати токен</Text>
        )}
      </TouchableOpacity>

      {token && (
        <View style={styles.tokenBox}>
          <Text style={styles.tokenTitle}>Згенерований токен:</Text>
          <Text style={styles.tokenText}>{token}</Text>
        </View>
      )}

      <View style={styles.secondaryActions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleCheckSavedToken}>
          <Text style={styles.secondaryButtonText}>Перевірити сховище</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.secondaryButton, styles.dangerButton]} onPress={handleClearToken}>
          <Text style={styles.secondaryButtonText}>Очистити токен</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#eef6ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b6d7ff',
  },
  tokenTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#004085',
  },
  tokenText: {
    fontSize: 12,
    color: '#333',
    fontFamily: 'monospace',
  },
  secondaryActions: {
    marginTop: 25,
    gap: 10,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#dc3545',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});