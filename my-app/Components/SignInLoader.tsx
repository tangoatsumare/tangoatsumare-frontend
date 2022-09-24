import React, { useEffect, useRef } from 'react';
import { View,  StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native';

const SignInLoader = () => {

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView 
      source={require('../assets/signin.json')}
      autoPlay loop
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    zIndex: 1
  }
});

export default SignInLoader