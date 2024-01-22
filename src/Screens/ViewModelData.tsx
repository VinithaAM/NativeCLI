import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Platform,
  StyleSheet,
  FlatList,
  TouchableHighlight,
} from 'react-native';
import Modal from 'react-native-modal';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {useRoute} from '@react-navigation/native';
import {ScreenType} from './StackNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getHistoryCorrection} from '../Services/CommonService';

function ViewModelData() {
  // console.log("view", props);
  //const route = useRoute();
  const [CorrectionData, setCorrectionData] = useState();
  const [columns, setColumns] = useState(1);
  const [ListData, setListData] = useState([]);
  //const receivedData = route.params as IHistoryDataCorrection[];
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      getHistoryData();
    }, 5000);
  }, []);
  const getHistoryData = () => {
    try {
      getHistoryCorrection()
        .then((result: any) => {
          if (result.data.status == 'Success') {
            setListData(result.data.data);
          }
        })
        .catch((error: any) => {
          console.log('Error occurred', error);
        });
    } catch (error) {
      console.log('Error occured', error);
    }
  };
  //setSelectedItem(props);
  const showModal = (item: any) => {
    setSelectedItem(item);
    setModalVisible(!modalVisible);
  };

  const hideModal = () => {
    setModalVisible(false);
  };
  const keyExtractor = (item: {id: number}) => {
    return item.id.toString();
  };
  return (
    <View></View>
    // <FlatList
    //   ItemSeparatorComponent={
    //     Platform.OS !== "android" &&
    //     (({ highlighted }) => (
    //       <View style={[highlighted && { marginLeft: 0 }]} />
    //     ))
    //   }
    //   data={ListData}
    //   keyExtractor={keyExtractor}
    //   renderItem={({ item, index, separators }) => (
    //     <TouchableHighlight
    //       key={item.key}
    //       onPress={() => this._onPress(item)}
    //       onShowUnderlay={separators.highlight}
    //       onHideUnderlay={separators.unhighlight}
    //     >
    //       <View style={{ backgroundColor: "white" }}>
    //         <Text>{item.title}</Text>
    //       </View>
    //     </TouchableHighlight>
    //   )}
    // />
  );
}
const style = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 1,
  },
  List: {
    marginTop: 8,
  },
  innerContainer: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItem: {
    flex: 1,
    //margin: 10,
    height: 45,
    borderRadius: 8,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    marginTop: 4,
    overflow: Platform.OS == 'android' ? 'hidden' : 'visible',
  },

  modalView: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  customButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 4,
    marginRight: 4,
    borderColor: 'blue',
  },

  buttonLogin: {
    backgroundColor: 'green',
    textAlign: 'center',
    color: 'white',
  },
  buttonDelete: {
    backgroundColor: 'red',
    textAlign: 'center',
  },
  buttonClear: {
    backgroundColor: '#131413',
    textAlign: 'center',
    color: 'white',
  },
});
export default ViewModelData;
