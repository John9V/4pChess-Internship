import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import translations from './config/translations';
import { LogBox, Platform } from 'react-native';

i18n.translations = translations;
i18n.locale = Localization.locale;
i18n.fallbacks = true;

export default function App(): JSX.Element | null {
  Platform.OS === 'android' && LogBox.ignoreLogs(['Setting a timer']);

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
