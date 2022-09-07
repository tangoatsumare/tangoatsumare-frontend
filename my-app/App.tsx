import { StyleSheet } from 'react-native';
// https://callstack.github.io/react-native-paper/1.0/getting-started.html
import {NavigationContainer} from "@react-navigation/native";
import { Provider as PaperProvider } from 'react-native-paper';
import { registerRootComponent } from 'expo';
import { Main } from "./screens/main";
import {Routes} from "./library/routes";
import {Home} from "./screens/home";
import "react-native-gesture-handler";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Card} from "./screens/card";
import {Profile} from "./screens/profile";
import {Settings} from "./screens/settings";

// function App() {
//   return (
//       <View style={styles.container}>
//         <Text>!!!!</Text>
//         <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>Hi</Button>
//         <StatusBar style="auto" />
//       </View>
//   );
// }

export default function App() {

    const Stack = createNativeStackNavigator();

    // const routes = () => Routes.map((route, i) =>
    //     <Stack.Screen name={route.name} component={route.component} key={i}/>;

    return (
      <PaperProvider>
          <NavigationContainer independent={true}>
              <Stack.Navigator initialRouteName={"Main"}>
                  <Stack.Screen
                      options={{headerShown: false, headerTitle: "Home"}}
                      name="Main" component={Main}/>
                  <Stack.Screen name="Home" component={Home}/>
                  <Stack.Screen name="Card" component={Card}/>
                  <Stack.Screen name="Settings" component={Settings}/>
                  <Stack.Screen name="Profile" component={Profile}/>


              </Stack.Navigator>
          </NavigationContainer>
      </PaperProvider>
  );
}

// https://docs.expo.dev/versions/latest/sdk/register-root-component/
registerRootComponent(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
