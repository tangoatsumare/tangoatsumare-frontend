import React, { useEffect, useRef } from 'react';
import { View,  StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native';

const LoginLoader = () => {

  // const animation = useRef<LottieView>();
  // const startAnimation = () => {
  //   if (animation.current) {
  //     animation.current.reset()
  //     animation.current.play()
  //   }
  // }

  // useEffect(() => {
  //   if (animation.current) {
  //     animation.current.play();
  //   }
  // }, [animation]);

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView 
      source={require('../assets/login3.json')}
      speed={0.8}
      autoPlay loop
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 1
  }
});

export default LoginLoader