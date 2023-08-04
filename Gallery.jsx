import React, { useState, useEffect , useRef } from 'react';
import { StyleSheet ,Text, View, Button, Image, TouchableOpacity , ScrollView , FlatList} from 'react-native';
import { Video} from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from 'cloudinary-react-native';

export default function Gallery({navigation,route}) {
    const {files}=route.params;

    const video = useRef(null);

    const [status, setStatus] = useState({});

    const [selectedFiles,setSelectedFiles]=useState([]);

    useEffect(() => {
        // Use `setOptions` to update the button that we previously specified
        // Now the button includes an `onPress` handler to update the count
        navigation.setOptions({
            headerRight: () => (
                <Button 
                    onPress={Upload} 
                    title={
                        "Upload"
                    } 
                />
            ),
        });
    }, [navigation]);

    const Upload=()=>{
        const cld = new Cloudinary({
            cloud: {
                cloudName: 'demo'
            }
        });
    }

    const selectFile=(file)=>{
        const index=selectedFiles.findIndex(object=>{
            return object.uri==file.uri;
        });

        if(index==-1){
            setSelectedFiles([...selectedFiles , file]);
        }else{
            const filtered=selectedFiles.filter(selectedFile=>selectedFile?.uri!=file?.uri);
            setSelectedFiles(filtered)
        }
    }

    const RenderFile=({item})=>{
        //prop's name can only be given as "item"
        return(
            item?.mediaType=="video" ?
                <TouchableOpacity style={styles.fileContainer} onPress={()=>selectFile(item)}>
                    <Video
                        ref={video}
                        style={styles.video}
                        source={{uri:item && item.uri}}
                        useNativeControls
                        resizeMode="cover"
                        // isLooping
                        // onPlaybackStatusUpdate={status => setStatus(() => status)}
                    />
                    {
                        selectedFiles?.map((selectedFile,i)=>{
                            return(
                                selectedFile!=[] && selectedFile?.uri===item?.uri ?
                                <View key={i} style={styles.selectedItem}>
                                    <AntDesign name="checkcircle" size={35} color="#007FFF" />
                                </View>
                                :
                                ""
                            )
                        })
                    }
                </TouchableOpacity>
            :

            <TouchableOpacity style={styles.fileContainer} onPress={()=>selectFile(item)}>
                <Image
                    source={{uri:item && item.uri}}
                    style={styles.image}
                />
                {
                    selectedFiles?.map((selectedFile,i)=>{
                        return(
                            selectedFile!=[] && selectedFile?.uri===item?.uri ?
                            <View key={i} style={styles.selectedItem}>
                                <AntDesign name="checkcircle" size={35} color="#007FFF" />
                            </View>
                            :
                            ""
                        )
                    })
                }
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
            contentContainerStyle={{flexGrow: 1, alignItems:"center"}}
        />
    );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    // flexDirection:"column",
    // flexWrap:"wrap"
  },
  image:{
    width:"100%",
    height:"100%",
    resizeMode:"cover",
    alignSelf:"stretch",
  },
  video:{
    width:"100%",
    height:"100%",
  },
  fileContainer:{
    marginHorizontal:8,
    marginVertical:5,
    position:"relative",
    width:110,
    height:110
  },
  selectedItem:{
    position:"absolute",
    width:"100%",
    height:"100%",
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent:"center",
    alignItems:"center"
  }
});
