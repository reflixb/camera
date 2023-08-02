import React, { useState, useEffect , useRef } from 'react';
import { StyleSheet ,Text, View, Button, Image, TouchableOpacity , ScrollView , FlatList} from 'react-native';
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

    // console.log(files)

    const RenderFile=({item})=>{
        //prop's name can only be given as "item"
        return(
            item?.mediaType=="video" ?
                <TouchableOpacity onPress={()=>selectFile(item)}>
                    <Video
                        ref={video}
                        style={styles.video}
                        source={{uri:item && item.uri}}
                        useNativeControls
                        resizeMode="cover"
                        // isLooping
                        // onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                </TouchableOpacity>
            :

            <TouchableOpacity onPress={()=>selectFile(item)}>
                <Image
                    source={{uri:item && item.uri}}
                    style={styles.image}
                />  
            </TouchableOpacity>
        )
    }

    return (
        // <ScrollView style={styles.container}>
        //     {
        //         files && files.assets.map((file,i)=>{
        //             return(
        //                 file.mediaType=="video" ?
        //                 <TouchableOpacity key={i} onPress={()=>selectFile(file)}>
        //                     <Video
        //                         ref={video}
        //                         style={styles.video}
        //                         source={{uri:file && file.uri}}
        //                         useNativeControls
        //                         resizeMode="cover"
        //                         // isLooping
        //                         // onPlaybackStatusUpdate={status => setStatus(() => status)}
        //                     />
        //                 </TouchableOpacity>
        //                 :

        //                 <TouchableOpacity key={i} onPress={()=>selectFile(file)}>
        //                     <Image
        //                         source={{uri:file && file.uri}}
        //                         style={styles.image}
        //                     />
        //                 </TouchableOpacity>
        //             )
        //         })
        //     }
        // </ScrollView>
        <FlatList
            data={files?.assets}
            // renderItem={({file}) => <RenderFile file={file} />}
            renderItem={RenderFile}
            numColumns={3}
            keyExtractor={file=>file.uri}
            key={file=>file.uri}
            // style={styles.container}
            contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        />
        // <Text>aa</Text>
    );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    // flexDirection:"column",
    // flexWrap:"wrap"
  },
  image:{
    width:100,
    height:100,
    resizeMode:"cover",
    alignSelf:"stretch",
    margin:5
  },
  video:{
    width:100,
    height:100,
    margin:5
  }
});
