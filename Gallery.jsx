import React, { useState, useEffect , useRef } from 'react';
import { StyleSheet ,Text, View, Button, Image, TouchableOpacity , ScrollView , FlatList} from 'react-native';

import { Video} from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

import { AntDesign } from '@expo/vector-icons';

export default function Gallery({navigation,route}) {
    const [mediaLibraryPermission,setMediaLibraryPermission]=useState(null);

    const [files,setFiles]=useState(null);

    const video = useRef(null);

    const [status, setStatus] = useState({});

    const [selectedFiles,setSelectedFiles]=useState([]);

    const [loadItemsCount,setLoadItemsCount]=useState(21);

    //ask media permission
    useEffect(()=>{
        (async () => {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === "granted") {
                setMediaLibraryPermission(status);
            }
        })();
    },[])

    useEffect(() => {
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

    useEffect(()=>{
        const getInitialFiles=async()=>{
            const initialFiles=await MediaLibrary.getAssetsAsync({
              first:loadItemsCount,
              sortBy:["creationTime"],
              mediaType:["photo","video"],
            });
    
            setFiles(initialFiles.assets)
        }

        getInitialFiles();
    },[loadItemsCount])

    // useEffect(()=>{
    //     const getMoreFiles=async()=>{
    //         const newFiles=await MediaLibrary.getAssetsAsync({
    //           first:loadItemsCount,
    //           sortBy:["creationTime"],
    //           mediaType:["photo","video"],
    //         //   after:files!=null?files[files.length-1].id : ""
    //         });
    
    //         setFiles(photos.assets)
    //         setFiles([...files , newFiles.assets])
    //     }

    //     getMoreFiles();
    // },[loadItemsCount]);

    const Upload=async()=>{
        // navigation.navigate("Camera" , {
        //     selectedFiles:selectedFiles
        // })
        const photo = selectedFiles[0];

        const info = await MediaLibrary.getAssetInfoAsync(photo);

        // console.log(info.filename);

        const data = new FormData();
        data.append("file", { uri: info.localUri, name: info.filename });
        data.append("upload_preset", "vgnfzq1k");
        data.append("cloud_name", "dt2qlgnd6");

        fetch("https://api.cloudinary.com/v1_1/dt2qlgnd6/upload", {
            method: "post",
            body: data,
        })
        .then((res) => res.json())
        .then((data) => {
            console.log("data", data.secure_url);
        })
        .catch((err) => {
            console.log(err);
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

    // console.log(files[files.length-1].id)

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
                                    {/* <Text>{i+1}</Text> */}
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
                                {/* <Text>{i+1}</Text> */}
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
            data={files}
            // renderItem={({file}) => <RenderFile file={file} />}
            renderItem={RenderFile}
            numColumns={3}
            keyExtractor={file=>file.uri}
            key={file=>file.uri}
            // style={styles.container}
            contentContainerStyle={{flexGrow: 1, alignItems:"center"}}
            onEndReached={()=>{setLoadItemsCount(prev=>prev+21)}}
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
