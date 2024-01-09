import React, {useCallback, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  FlatList,
  LayoutAnimation,
  Platform,
  Dimensions,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {format} from 'date-fns';
import Modal from 'react-native-modal';
import {Dropdown} from 'react-native-element-dropdown';
import {
  StarOutlined,
  StarFilled,
  StarTwoTone,
  SafetyOutlined,
} from '@ant-design/icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {
  MasterHistoryData,
  deleteCorrection,
  getHistoryCorrection,
  updateCorrectionDetails,
} from '../Services/CommonService';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {ScreenType} from './StackNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useFocusEffect} from '@react-navigation/native';

type Proptype = NativeStackScreenProps<ScreenType, 'Accordion'>;
function Accordions(props: {title: any}, prop: Proptype) {
  var prop: Proptype;
  const {navigation} = prop;
  const [ListData, setListData] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModelVisible, setDeleteModelVisible] = useState(false);
  const [renderItem, setrenderItem] = useState([]);
  const [isExpand, setIsExpand] = useState(false);
  const [value, setValue] = useState('');
  const [masterValue, setMasterValue] = useState([]);
  const [historyId, sethistoryId] = useState('');
  const [showDatePick, setShowDatePicker] = useState(false);
  const [mode, setmode] = useState('date');
  const [timeStamp, settimeStamp] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [correctionValue, setcorrectionValue] = useState(0);
  const [status, setstatus] = useState('');
  const [refreshDate, setRefreshDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  //setListData(props);

  const toggleExpand = () => {
    setViewModalVisible(!viewModalVisible);
    setIsExpand(!isExpand);
  };
  const masterDatafetch = () => {
    MasterHistoryData().then(result => {
      setMasterValue(result.data.data);
      setLoading(false);
    });
  };
  const OnShow = (mode: string) => {
    setShowDatePicker(true);
    setmode(mode);
  };
  const hideEditModal = () => {
    setEditModalVisible(false);
  };
  const renderItemmaster = (item: any) => {
    return (
      <View style={style.item}>
        <Text style={style.textItem}>{item.historyId}</Text>
        {item.value === value && <SafetyOutlined />}
      </View>
    );
  };
  const onChangeDate = (selectedDate: any) => {
    if (selectedDate.type == 'set') {
      const currentdate = selectedDate.nativeEvent.timestamp;
      console.log('Date', currentdate);
      // var newDate = moment(new Date(1528101680 * 1000)).format('MM/DD/YYYY hh:MM');
      //                           -----------^^^^^^^------------
      //console.log(newDate);
      //setDate(currentdate);
      //settimeStamp(currentdate);
      if (Platform.OS === 'android') {
        // settimeStamp(currentdate);
      }
      // showDatePicker();
    } else {
      // showDatePicker();
    }
    // console.log('selecteddate', selectedDate);
    // var newDate = new Date(selectedDate);
    setShowDatePicker(Platform.OS === 'ios');
    // if (newDate) {
    //   //setDate(selectedDate);
    //   // var date = formatDate(newDate);
    //   settimeStamp(selectedDate);
    //   setDate(selectedDate);
    // }
  };
  const items = (i: any) => {
    // console.log("q", i);
    return i.historyId;
  };
  const onUpdateDetails = (item: any) => {
    let params = {
      id: item.id,
      historyId: historyId,
      timeStamp: timeStamp,
      value: correctionValue,
      statusTags: status,
      correctedValue: correctionValue,
      createdBy: item.createdBy,
      dateCreated: item.dateCreated,
      lastModifiedBy: 1,
      dateModified: new Date(),
    };
    try {
      updateCorrectionDetails(params)
        .then((result: any) => {
          if (result.data.status == 'Success') {
            Alert.alert('Update SuccessFully');
            correctionDatafetch();
            //setRefreshDate(new Date());
            onRefresh();
            //setSelectedItem
            // setSelectedItem(result.data.data);
            // navigation.navigate("FlatListPage");
            setEditModalVisible(false);
          }
        })
        .catch((error: any) => {
          console.log('Error occurred', error);
          navigation.navigate('LoginPage');
        });
    } catch (error) {
      console.log('Error occured', error);
      navigation.navigate('LoginPage');
    }
  };
  // useEffect(() => {
  //   if (refreshDate == new Date) {
  //     void refreshData();
  //   }
  // }, []);
  const onConfirm = (e: any) => {
    try {
      deleteCorrection(e.id)
        .then((result: any) => {
          if (result.data.status == 'Success') {
            Alert.alert('Deleted Successfully');
            correctionDatafetch();
            //setRefreshDate(new Date());

            setViewModalVisible(false);
          }
        })
        .catch((error: any) => {
          console.log('Error occurred', error);
          navigation.navigate('LoginPage');
        });
    } catch (error) {
      console.log('Error occured', error);
      navigation.navigate('LoginPage');
    }
  };
  // function onChangeStatus(e: any) {
  //   const regex = /^[a-zA-Z]*$/;
  //   if (regex.test(e) || e === "") {
  //     setstatus(e);
  //   }
  // }
  // function onChangeValue(e: any) {
  //   setcorrectionValue(e);
  // }
  const onClickDelete = (item: any) => {
    setDeleteModelVisible(true);
    setSelectedItem(item);
  };
  function onChangeStatus(e: any) {
    const regex = /^[a-zA-Z]*$/;
    if (regex.test(e) || e === '') {
      setstatus(e);
    }
  }
  function onChangeValue(e: any) {
    const regex = /^\d*\.?\d*$/;
    if (regex.test(e) || e === '') {
      setcorrectionValue(e);
    }
    //setcorrectionValue(e);
  }
  const [selectedItem, setSelectedItem] = useState(props.title);
  const onClickEdit = (item: any) => {
    setLoading(true);
    setEditModalVisible(true);
    masterDatafetch();
    sethistoryId(item.historyId);

    setDate(new Date(item.timeStamp));
    setstatus(item.statusTags);
    setcorrectionValue(item.correctedValue);
    setSelectedItem(item);
    settimeStamp(item.timeStamp);
  };
  const correctionDatafetch = () => {
    getHistoryCorrection().then(result => {
      if ((result.data.status = 'Success')) {
        //setSelectedItem(result.data.data);
        prop = result.data.data;
        // if (selectedItem.historyId == result.data.data.historyId) {
        var filtereted = result.data.data.filter(
          (x: any) => x.historyId == selectedItem.historyId,
          // &&
          // x.statusTags == selectedItem.statusTags
          //&&
          //x.correctedValue == selectedItem.correctedValue
        )[0];
        console.log('filter', filtereted);
        if (filtereted) {
          setSelectedItem(filtereted);
        }
        // setSelectedItem(filtereted);
        // }
        console.log('after', selectedItem);
      }
    });
  };
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  // useFocusEffect(
  //   useCallback(() => {
  //     correctionDatafetch();
  //   }, [])
  // );
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setisTimePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: any) => {
    console.warn('A date has been picked: ', date);
    var newDate = new Date(date);
    settimeStamp(newDate);
    hideDatePicker();
  };
  const handleConfirmTime = (event: any) => {
    const newtime = new Date(event);

    console.warn('A time has been picked: ', newtime, event);
    hideTimePicker();
  };
  const hideTimePicker = () => {
    setisTimePickerVisible(false);
  };
  return (
    <View style={[style.gridItem, {backgroundColor: 'pink'}]}>
      <Pressable
        android_ripple={{color: '#ccc'}}
        style={({pressed}) => [
          style.button,
          pressed ? style.buttonPressed : null,
        ]}
        onPress={() => toggleExpand()}>
        <ScrollView
          contentContainerStyle={style.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }></ScrollView>
        <View style={style.innerContainer}>
          <View style={style.bodycontainer}>
            <Text style={style.title}>{selectedItem.historyId} </Text>
            {/* <AntDesign
              name={viewModalVisible ? "downcircle" : "rightcircle"}
              size={24}
              color="black"
            /> */}
          </View>
        </View>
        {/* <View style={style.innerContainer}>
          <View style={style.bodycontainer}>
            <View style={[style.gridItem, { backgroundColor: "lightpink" }]}>
              <Text>{props.title.historyId}</Text>
              <AntDesign
                name={viewModalVisible ? "downcircle" : "rightcircle"}
                size={24}
                color="black"
              />
            </View>
          </View>
        </View> */}
      </Pressable>
      {isExpand && (
        <View style={style.viewModalView}>
          <View style={style.textContainer}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: 12,
              }}>
              MasterName :
            </Text>
            <Text> {selectedItem.historyId} </Text>
          </View>
          <View style={style.textContainer}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: 12,
              }}>
              TimeStamp :
            </Text>
            <Text>
              {selectedItem.timeStamp}
              {/* {format(new Date(selectedItem.timeStamp), 'dd/MM/yyyy HH:mm')} */}
            </Text>
          </View>
          <View style={style.textContainer}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: 12,
              }}>
              Status :
            </Text>
            <Text> {selectedItem.statusTags}</Text>
          </View>
          <View style={style.textContainer}>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'black',
                fontSize: 12,
              }}>
              Value :
            </Text>
            <Text> {selectedItem.correctedValue}</Text>
          </View>
          <View style={style.buttonContainer}>
            {/* <Pressable
              style={[style.buttonClear, style.customButton]}
               onPress={hideModal}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </Pressable> */}
            <TouchableOpacity
              style={[style.buttonLogin, style.customButton]}
              onPress={() => onClickEdit(selectedItem)}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[style.buttonDelete, style.customButton]}
              onPress={() => onClickDelete(selectedItem)}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Modal animationIn="slideInUp" isVisible={editModalVisible}>
        <View style={style.modalView}>
          {editModalVisible && (
            <View style={{backgroundColor: 'White'}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: 'darkblue',
                  fontSize: 20,
                }}>
                Update Details
              </Text>
              <View style={style.viewContainer}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: 12,
                  }}>
                  MasterName :
                </Text>
                <Dropdown
                  style={style.dropdown}
                  placeholderStyle={style.placeholderStyle}
                  selectedTextStyle={style.selectedTextStyle}
                  inputSearchStyle={style.inputSearchStyle}
                  iconStyle={style.iconStyle}
                  data={masterValue}
                  search
                  maxHeight={300}
                  labelField="historyId"
                  valueField="historyId"
                  placeholder="Select item"
                  searchPlaceholder="Search..."
                  value={selectedItem.historyId}
                  onChange={item => {
                    sethistoryId(item.historyId);
                  }}
                  // renderLeftIcon={() => (
                  //   <AntDesign
                  //     style={style.icon}
                  //     color="black"
                  //     name="Safety"
                  //     size={20}
                  //   />
                  // )}
                  renderItem={renderItemmaster}></Dropdown>
              </View>
              <View style={style.viewContainer}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: 12,
                  }}>
                  TimeStamp :
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Pressable onPress={() => showDatePicker()}>
                      <Text style={style.Datepicker}> Date</Text>
                    </Pressable>
                    {/* <Pressable onPress={() => setisTimePickerVisible(true)}>
                      <Text style={style.Datepicker}> Time</Text>
                    </Pressable> */}

                    <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="datetime"
                      onConfirm={handleConfirmDate}
                      onCancel={hideDatePicker}
                    />
                    {/* <DateTimePickerModal
                      isVisible={isTimePickerVisible}
                      mode="time"
                      onConfirm={handleConfirmTime}
                      onCancel={hideTimePicker}
                    /> */}
                  </View>
                  {/* {showDatePick && (
                  <RNDateTimePicker
                    value={date}
                    mode="datetime"
                    display="spinner"
                    onChange={onChangeDate}
                  />
                )} */}
                  <Text
                    style={{
                      textAlign: 'center',
                      marginLeft: 5,
                      marginTop: 5,
                      marginBottom: 5,
                      fontSize: 15,
                    }}>
                    {/* {timeStamp} */}
                    {/* {timeStamp.toString()} */}
                    {format(timeStamp, 'dd/MM/yyyy HH:mm')}
                  </Text>
                </View>
              </View>
              <View style={style.viewContainer}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: 12,
                  }}>
                  Status :
                </Text>
                <TextInput
                  style={style.inputfield}
                  value={status}
                  onChangeText={onChangeStatus}
                  maxLength={15}></TextInput>
              </View>
              <View style={style.viewContainer}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                    fontSize: 12,
                  }}>
                  Value :
                </Text>
                <TextInput
                  style={style.inputfield}
                  keyboardType="numeric"
                  value={correctionValue.toString()}
                  onChangeText={onChangeValue}
                  maxLength={8}></TextInput>
              </View>
              <View style={style.buttonContainer}>
                <Pressable
                  style={[style.buttonLogin, style.customButton]}
                  onPress={() => onUpdateDetails(selectedItem)}>
                  <Text style={{color: '#fff'}}>Save</Text>
                </Pressable>
                <Pressable
                  style={[style.buttonClear, style.customButton]}
                  onPress={hideEditModal}>
                  <Text style={{color: '#fff'}}>Close</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </Modal>
      <Modal animationIn="slideInUp" isVisible={deleteModelVisible}>
        <View style={style.deleteModalView}>
          <View style={{backgroundColor: 'White'}}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'darkblue',
              }}>
              Are you sure you want to proceed?
            </Text>
            <View style={style.viewContainer}>
              <Pressable
                style={[style.buttonLogin, style.customButton]}
                onPress={() => {
                  setDeleteModelVisible(false);
                  onConfirm(selectedItem);
                }}>
                <Text style={style.buttonText}>Confirm</Text>
              </Pressable>
              <Pressable
                style={[style.cancelButton, style.customButton]}
                onPress={() => {
                  setDeleteModelVisible(false);
                }}>
                <Text style={[style.buttonText]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <View />
    </View>
  );
}
const width = Dimensions.get('window').width - 70;
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  button: {
    flex: 1,
  },
  buttonPressed: {
    opacity: 1,
  },
  List: {
    marginTop: 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 5,
  },
  dropdown: {
    margin: 10,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    width: 200,
    // marginLeft: 70,
    //marginRight: 10,
    //marginLeft: 5,
  },
  textItem: {
    flex: 1,
    fontSize: 11,
  },
  bodycontainer: {
    flexDirection: 'row',
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: 'lightgray',
  },
  Datepicker: {
    padding: 3,
    borderRadius: 10,
    marginBottom: 5,
    borderColor: 'blue',
    backgroundColor: 'lightblue',
    // marginRight: 100,
    marginLeft: 8,
    width: 50,
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
    marginTop: 10,
    fontWeight: 'bold',
  },
  innerContainer: {
    flexGrow: 1,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  newButton: {
    padding: 5,
    backgroundColor: 'green',
    borderRadius: 10,
    alignSelf: 'flex-end',
    margin: 15,
  },
  signoutButton: {
    padding: 5,
    backgroundColor: 'orange',
    borderRadius: 5,
    alignSelf: 'flex-end',
    margin: 10,
  },
  eachCard: {
    height: 100,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#850D5F',
    //width: width,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inputfield: {
    width: 200,
    height: 40,
    borderRadius: 15,
    paddingLeft: 20,
    borderWidth: 2,
    borderColor: 'blue',
    marginBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    marginLeft: 5,
  },
  items: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 5,
  },
  modalView: {
    flexGrow: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  viewModalView: {
    flexgrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5c4ef',
  },
  gridItem: {
    flex: 1,
    //marginleft: 18,
    //height: 45,
    borderRadius: 8,
    elevation: 4,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    marginTop: 3,
    marginRight: 8,
    marginLeft: 8,
    marginBottom: 3,
    overflow: Platform.OS == 'android' ? 'hidden' : 'visible',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContainer: {
    flexDirection: 'row',
    // justifyContent: "center",
    // alignItems: "center",
  },

  customButton: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 4,
    marginRight: 4,
    borderColor: 'blue',
  },
  deleteModalView: {
    flex: 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
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
  inputTitle: {
    paddingLeft: 20,
    // opacity: 0.5,
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'serif',
    fontSize: 15,
    marginRight: 15,
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
});
export default Accordions;