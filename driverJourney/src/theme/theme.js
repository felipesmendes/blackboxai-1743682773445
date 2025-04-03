import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0066cc',
    secondary: '#4CAF50',
    background: '#ffffff',
    surface: '#f8f8f8',
    error: '#B00020',
    text: '#000000',
    onSurface: '#000000',
    disabled: '#C9C9C9',
    placeholder: '#666666',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: '#f50057',
  },
  roundness: 8,
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
    },
  },
};

export default theme;