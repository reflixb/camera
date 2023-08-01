import React, { useState, useEffect } from 'react';
import { StyleSheet ,Text, View, Button, Image, TouchableOpacity , ScrollView} from 'react-native';

export default function Gallery({route,navigation}) {
    const {files}=route.params;

    // console.log(files)

    const selectImage=(file)=>{
        navigation.navigate("Camera" , {
            selectedFile:file
        })
    }

    return (
        <ScrollView style={styles.container}>
            {
                files && files.assets.map((file,i)=>{
                    return(
                        // <TouchableOpacity
                        //     style={styles.image}
                        //     onPress={selectImage(file)}
                        //     key={i}
                        // >
                            <Image
                                source={{uri:file && file.uri}}
                                style={styles.image}
                                key={i}
                                // onPress={selectImage(file)}
                            />
                        // </TouchableOpacity>
                    )
                })
            }
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:"row",
    flexWrap:"wrap",
    width:"100%",
    backgroundColor:"red"
  },
  image:{
    width:90,
    height:90,
    resizeMode:"cover",
    margin:1,
  }
});
