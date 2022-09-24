import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  Image,
  useWindowDimensions,
  Animated
} from 'react-native';

interface IData {
  id: string,
  title: string,
  image: string
}

export const Tutorial = () => {

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const data = [
    {
      id: "1",
      title: 'tutorial1',
      image: require('../assets/tutorial1.png')
    },
    {
      id: "2",
      title: 'tutorial2',
      image: require('../assets/tutorial2.png')
    },
    {
      id: "3",
      title: 'tutorial3',
      image: require('../assets/tutorial3.png')
    },
    {
      id: "4",
      title: 'tutorial4',
      image: require('../assets/tutorial4.png')
    }
  ];

  const { width } = useWindowDimensions();

  const Item = ({ item }) => {
    return (
      <View style={[styles.container, { width }]}>
        <Image
          source={item}
          style={[styles.image, { width, resizeMode: 'contain' }]}
        />
      </View>
    );
  };

  const _renderItem = (listRenderItemInfo: ListRenderItemInfo<IData>) => {
    return <Item item={listRenderItemInfo.item.image} />;
  };

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index)
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={data}
          renderItem={_renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator
          pagingEnabled
          bounces={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    backgroundColor: 'white',
    zIndex: 1,
    justifyContent: 'center'
  }
});