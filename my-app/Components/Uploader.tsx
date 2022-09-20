import React, { useEffect, useRef } from 'react';
import { View,  StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native';

const Uploader = () => {

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <LottieView 
      source={require('../assets/uploading2.json')}
      speed={1.5}
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

export default Uploader