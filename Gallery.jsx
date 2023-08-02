import React, { useState, useEffect , useRef } from 'react';
import { StyleSheet ,Text, View, Button, Image, TouchableOpacity , ScrollView} from 'react-native';
import { Video} from 'expo-av';

export default function Gallery({route,navigation}) {
    const {files}=route.params;

    const video = useRef(null);

    const [status, setStatus] = useState({});

    const selectFile=(file)=>{
        // navigation.navigate("Camera",{
        //     selectedFile:file
        // });
    }

    return (
        <ScrollView style={styles.container}>
            {
                files && files.assets.map((file,i)=>{
                    return(
                        file.mediaType=="video" ?
                        <TouchableOpacity key={i} onPress={()=>selectFile(file)}>
                            <Video
                                ref={video}
                                style={styles.video}
                                source={{uri:file && file.uri}}
                                useNativeControls
                                resizeMode="cover"
                                // isLooping
                                // onPlaybackStatusUpdate={status => setStatus(() => status)}
                            />
                        </TouchableOpacity>
                        :

                        <TouchableOpacity key={i} onPress={()=>selectFile(file)}>
                            <Image
                                source={{uri:file && file.uri}}
                                style={styles.image}
                            />
                        </TouchableOpacity>
                    )
                })
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:"row",
    flexWrap:"wrap"
  },
  image:{
    width:100,
    height:100,
    resizeMode:"cover",
    alignSelf:"stretch"
  },
  video:{
    width:100,
    height:100
  }
});
