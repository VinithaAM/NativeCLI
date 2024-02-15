import {  View } from "react-native";
import React from 'react';
import {  Text, Tooltip } from 'react-native-elements';

const TruncatedTextWithTooltip = ({ text, maxLength }) => {
    // Trim the text if it exceeds the maxLength
    // const trimmedText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    const trimmedText = text.length > maxLength ? text.substring(0,maxLength)+"....":text
    // .slice(0, maxLength) + '...' : text;

    return (
      <View>
        {text.length > maxLength ? (
          <Tooltip popover={
            // <View style={{ width: 200}}>
          <Text style={{fontSize:15,fontWeight:"bold",color:"#0505fa",alignItems:"center"}}>{text}</Text>
        //   </View>
        }
        
        withPointer={true}
           width={450}
           backgroundColor="#d2f7ba">
            <Text style={{fontSize:15,fontWeight:"bold",color:"#0505fa"}}>{trimmedText}</Text>
          </Tooltip>
        ) : (
          <Text style={{fontSize:15,fontWeight:"bold",color:"#0505fa"}}>{text}</Text>
        )}
      </View>
    );
  };
  
  export default TruncatedTextWithTooltip;