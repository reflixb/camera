import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Linking } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as VideoThumbnails from "expo-video-thumbnails";
import { PinchGestureHandler } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

export default function CameraComponent({ route, navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState();
  const cameraRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);

  const openImagePickerAsync = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const isFocused = useIsFocused();

  const [galleryFirstItemThumbnailUri, setGalleryFirstItemThumbnailUri] =
    useState();

  const [zoom, setZoom] = useState(0);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission(status);
      if (status === "granted") {
        const albumName = "Camera";
        const getFiles = await MediaLibrary.getAlbumAsync(albumName);

        const firstItem = await MediaLibrary.getAssetsAsync({
          first: 1,
          album: getFiles,
          sortBy: ["creationTime"],
          mediaType: ["photo", "video"],
        });

        if (firstItem.assets[0].mediaType == "photo") {
          setGalleryFirstItemThumbnailUri(firstItem.assets[0].uri);
        } else {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            firstItem.assets[0].uri,
            {
              time: 15000,
            }
          );
          setGalleryFirstItemThumbnailUri(uri);
        }
      }
    })();
  }, []);

  const flipCamera = () => {
    setType(
      type == Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);
      await savePictureToMediaLibrary(photo.uri);
    }
  };

  const savePictureToMediaLibrary = async (uri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(uri);
      console.log("Image saved to media library", asset);
    } catch (error) {
      console.log("Error saving image to media library", error);
    }
  };

  // const moveToGallery = () => {
  //   Linking.openSettings({ app: "Gallery" }).catch((err) => {
  //     console.error("An error occurred", err);
  //   });
  // };

  const changeZoom = (event) => {
    if (event.nativeEvent.scale > 1 && zoom < 1) {
      setZoom(zoom + 0.05);
    }
    if (event.nativeEvent.scale < 1 && zoom > 0) {
      setZoom(zoom - 0.05);
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return images.length !== 0 ? (
    <SafeAreaView style={styles.container}>
      <Text>Images go here</Text>
    </SafeAreaView>
  ) : isFocused ? (
    <View style={styles.container}>
      <StatusBar hidden />

      <View style={styles.blackTop}></View>

      <View style={styles.cameraContainer}>
        <PinchGestureHandler onGestureEvent={(event) => changeZoom(event)}>
          <Camera
            ref={cameraRef}
            type={type}
            ratio={"4:3"}
            style={styles.camera}
            zoom={zoom}
          />
        </PinchGestureHandler>
        <View style={styles.zoomContainer}>
          <View style={styles.zoomBubble}>
            <Text style={styles.zoomText}>1X</Text>
          </View>
        </View>
      </View>

      <View style={styles.blackBottom}>
        <TouchableOpacity onPress={openImagePickerAsync} style={styles.gallery}>
          <MaterialIcons name="photo-camera-back" size={34} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <View style={styles.innerButton}></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={flipCamera} style={styles.gallery}>
          <Entypo name="cycle" size={34} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  blackTop: {
    backgroundColor: "black",
    width: "100%",
    height: 65,
  },
  cameraContainer: {
    width: "100%",
    height: 525,
    position: "relative",
    alignItems: "center",
  },
  zoomContainer: {
    position: "absolute",
    bottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  zoomBubble: {
    borderRadius: 50,
    aspectRatio: 1 / 1,
    padding: 8,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    marginHorizontal: 10,
  },
  zoomText: {
    color: "white",
    fontSize: 12,
  },
  blackBottom: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  gallery: {
    borderRadius: 50,
    width: 55,
    height: 55,
    backgroundColor: "#393e46",
    aspectRatio: 1 / 1,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    width: 75,
    height: 75,
    backgroundColor: "#393e46",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  innerButton: {
    width: 64,
    height: 64,
    backgroundColor: "white",
    borderRadius: 50,
  },
});

// import { Camera, CameraType } from "expo-camera";
// import { useState, useEffect } from "react";
// import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import React from "react";
// import { useRef } from "react";
// import * as MediaLibrary from "expo-media-library";
// import { Feather, Ionicons } from "@expo/vector-icons";

// export default function CameraScreen({ navigation }) {
//   const [type, setType] = useState(CameraType.back);
//   const [permission, requestPermission] = Camera.useCameraPermissions();
//   const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
//   const cameraRef = useRef(null);

//   useEffect(() => {
//     requestMediaLibraryPermission();
//   }, []);

//   const requestMediaLibraryPermission = async () => {
//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     if (status !== "granted") {
//       console.log("Media Library permission not granted");
//     }
//   };

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ textAlign: "center" }}>
//           We need your permission to show the camera
//         </Text>
//         <Button onPress={requestPermission} title="Grant Permission" />
//       </View>
//     );
//   }

//   function toggleCameraType() {
//     setType((current) =>
//       current === CameraType.back ? CameraType.front : CameraType.back
//     );
//   }

//   function toggleTorch() {
//     setFlashMode((current) =>
//       current === Camera.Constants.FlashMode.off
//         ? Camera.Constants.FlashMode.torch
//         : Camera.Constants.FlashMode.off
//     );
//   }

//   async function takePicture() {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync();
//       console.log(photo);
//       await savePictureToMediaLibrary(photo.uri);
//     }
//   }

//   const savePictureToMediaLibrary = async (uri) => {
//     try {
//       const asset = await MediaLibrary.createAssetAsync(uri);
//       console.log("Image saved to media library", asset);
//     } catch (error) {
//       console.log("Error saving image to media library", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Camera
//         style={styles.camera}
//         type={type}
//         flashMode={flashMode}
//         ref={cameraRef}
//         ratio={"4:3"}
//       >
//         <View style={styles.buttonContainer}>
//           <View style={styles.buttonRow}>
//             <TouchableOpacity onPress={toggleTorch} style={styles.buttonIcon}>
//               <Feather
//                 name={
//                   flashMode === Camera.Constants.FlashMode.off
//                     ? "zap-off"
//                     : "zap"
//                 }
//                 size={24}
//                 color="white"
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.centeredButtonRow}>
//             <TouchableOpacity
//               style={styles.photosButton}
//               onPress={() => navigation.navigate("Media")}
//             >
//               <Text style={styles.photosButtonText}>Photos</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={takePicture}
//               style={styles.captureButton}
//             >
//               <View style={styles.captureIcon} />
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={toggleCameraType}
//               style={styles.buttonIcon}
//             >
//               <Ionicons
//                 name={
//                   type === CameraType.back
//                     ? "camera-reverse-outline"
//                     : "camera-outline"
//                 }
//                 size={24}
//                 color="white"
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Camera>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   camera: {
//     flex: 1,
//   },
//   buttonContainer: {
//     flex: 1,
//     flexDirection: "column",
//     backgroundColor: "transparent",
//     justifyContent: "space-between",
//     padding: 16,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   centeredButtonRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   buttonIcon: {
//     padding: 16,
//   },
//   captureButton: {
//     backgroundColor: "white",
//     borderRadius: 50,
//     padding: 5,
//     alignSelf: "center",
//     marginBottom: 50,
//   },
//   captureIcon: {
//     width: 64,
//     height: 64,
//     borderRadius: 50,
//     backgroundColor: "white",
//     borderWidth: 2,
//     borderColor: "black",
//   },
//   photosButton: {
//     alignSelf: "center",
//   },
//   photosButtonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "white",
//   },
// });
