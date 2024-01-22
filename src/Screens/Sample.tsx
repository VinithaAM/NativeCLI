import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';

function Sample(props: any) {
  console.log('Prop', props);
  return (
    <View style={style.container}>
      <Pressable style={style.titleContainer}>
        <Text style={style.textTitle}>{props.title}</Text>
      </Pressable>
    </View>
  );
}

export default Sample;
const style = StyleSheet.create({
  container: {
    backgroundColor: '#E3EDFB',
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#0F5683',
  },
  titleContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: 16,
    color: 'black',
  },
});
