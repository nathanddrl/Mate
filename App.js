import React from 'react';
import './firebase';
import RootNavigation from './navigation';
import { ThemeProvider, Button, createTheme } from '@rneui/themed';

const theme = createTheme({
  components: {
    Button: {
      raised: true,
    },
  },
});
export default function App() {
  return (
    <ThemeProvider>
      <RootNavigation />
    </ThemeProvider>
  );
}