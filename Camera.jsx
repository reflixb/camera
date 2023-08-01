import React, { useState, useEffect } from 'react';
import { StyleSheet ,Text, View, Button, Image, TouchableOpacity} from 'react-native';
import { Camera } from 'expo-camera';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import * as MediaLibrary from 'expo-media-library';

import { useIsFocused } from '@react-navigation/native';

export default function CameraComponent({route,navigation}) {
  const [hasCameraPermission, setHasCameraPermission] = useState({
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  });
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [image,setImage]=useState(null);

  const isFocused = useIsFocused();

  // useEffect(async () => {
  //   // const { status } = Permissions.askAsync(Permissions.CAMERA);
    
  //   // setHasCameraPermission(prevState => ({ ...prevState, hasCameraPermission: status === 'granted'}));
  // }, []);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const flipCamera=async()=>{
    setType(type==Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
  }

  const takePicture = async () => {
    if(camera){
      const data = await camera.takePictureAsync(null)
      console.log(data)
      setImage(data.uri);
    }
  }

  const discardImage= async()=>{
    setImage(null);
  }

  const saveImage=async()=>{
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      await MediaLibrary.saveToLibraryAsync(image);
      setImage(null)
      console.log("Image successfully saved");
    }
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const getFilesAndMove=async()=>{
    const albumName='Camera';
    const getPhotos=await MediaLibrary.getAlbumAsync(albumName);

    const photos=await MediaLibrary.getAssetsAsync({
      first:100,
      album:getPhotos,
      sortBy:["creationTime"],
      mediaType:["photo"]
    });

    navigation.navigate("Gallery" , {
        files:photos
    })
  }

  return (
    <View style={styles.cameraContainer}>
      {
        image ? 
          <Image
            source={{uri:image && image}}
            style={styles.image}
          />
        :
          <View style={styles.cameraContainer}>
            {
              isFocused ?
                <Camera  
                ref={ref => setCamera(ref)}
                type={type}
                ratio={'16:9'} 
                style={styles.camera}
                />
              :
              ""
            }
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity onPress={getFilesAndMove}>
                <Entypo name="images" size={40} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.flipCameraContainer}>
              <TouchableOpacity onPress={flipCamera}>
                <MaterialCommunityIcons name="camera-flip" size={40} color="black" />
              </TouchableOpacity>
            </View>
          </View>
      }
      <View style={styles.settingsContainer}>
        {
          image ? 
            <View style={styles.sendImageContainer}>
              <MaterialCommunityIcons style={styles.send} name="send-circle" size={60} color="black" />
              <TouchableOpacity style={styles.discard} onPress={discardImage}>
                <Entypo name="cross" size={50} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.save} onPress={saveImage}>
                <MaterialIcons name="save-alt" size={50} color="black" />
              </TouchableOpacity>
            </View>
          :
            <TouchableOpacity 
              onPress={takePicture}
              style={styles.button}
              >
            </TouchableOpacity>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    flexDirection:"row",
    position:"relative",
  },
  camera:{
    flex:1,
    width:"100%"
  },
  image:{
    flex:1,
    // width:100,
    // height:100
  },
  settingsContainer:{
    position:"absolute",
    // backgroundColor:"blue",
    width:"100%",
    height:"100%",
    flex:1,
    alignItems:"center"
  },
  button:{
    backgroundColor:"white",
    position:"absolute",
    bottom:10,
    width:70,
    aspectRatio:1/1,
    borderRadius:50
  },
  sendImageContainer:{
    position:"relative",
    flex:1,
    width:"100%",
  },
  send:{
    position:"absolute",
    right:10,
    bottom:10
  },
  discard:{
    position:"absolute",
    top:10,
    left:10
  },
  save:{
    position:"absolute",
    left:10,
    bottom:10
  },
  imagePickerContainer:{
    position:"absolute",
    left:10,
    bottom:10
  },
  flipCameraContainer:{
    position:"absolute",
    right:10,
    bottom:10
  }
});
