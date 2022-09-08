import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// https://callstack.github.io/react-native-paper/1.0/getting-started.html
import { Provider as PaperProvider } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { registerRootComponent } from 'expo';

import { OCR } from './screens/OCR';

function App() {
  return (
      <OCR />
      // <View style={styles.container}>
      //   <Text>!!!!</Text>
      //   <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>Hi</Button>
      //   <StatusBar style="auto" />
      // </View>
  );
}

export default function Main() {
  return (
    <PaperProvider>
      <App />
    </PaperProvider>
  );
}

// https://docs.expo.dev/versions/latest/sdk/register-root-component/
registerRootComponent(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
