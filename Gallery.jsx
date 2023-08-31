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
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as VideoThumbnails from "expo-video-thumbnails";
import { PinchGestureHandler } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";

export default function CameraComponent({ route, navigation }) {
  useEffect(() => {
    if (route.params?.selectedFiles) {
      // console.log(route.params.selectedFiles)
    }
  }, [route.params?.selectedFiles]);

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState();
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [images, setImages] = useState([]);

  const isFocused = useIsFocused();

  const [galleryFirstItemThumbnailUri, setGalleryFirstItemThumbnailUri] =
    useState();

  const [zoom, setZoom] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);

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

  const flipCamera = async () => {
    setType(
      type == Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log(data);
      setImages(data.uri);
    }
  };

  const discardImage = async () => {
    setImages([]);
  };

  const saveImage = async () => {
    // const { status } = await MediaLibrary.requestPermissionsAsync();
    // if (status === "granted") {
    //   await MediaLibrary.saveToLibraryAsync(image);
    //   setImages([])
    //   console.log("Image successfully saved");
    // }
  };

  const moveToGallery = async () => {
    navigation.navigate("Gallery");
  };

  const changeZoom = (event) => {
    if (event.nativeEvent.scale > 1 && zoom < 1) {
      setZoom(zoom + 0.05);
    }
    if (event.nativeEvent.scale < 1 && zoom > 0) {
      setZoom(zoom - 0.05);
    }
  };

  if (hasCameraPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return images.length != 0 ? (
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
            ref={(ref) => setCamera(ref)}
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
        <TouchableOpacity onPress={moveToGallery} style={styles.gallery}>
          <Image
            source={{ uri: galleryFirstItemThumbnailUri }}
            style={styles.thumbnail}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takePicture}>
          <View style={styles.innerButton}></View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={flipCamera}
          style={styles.flipCameraContainer}
        >
          <Entypo name="cycle" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    ""
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
    width: 50,
    height: 50,
    aspectRatio: 1 / 1,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    aspectRatio: 1 / 1,
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
  flipCameraContainer: {
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: "#393e46",
    aspectRatio: 1 / 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
