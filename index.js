const express = require('express');
//import models from './models'
const assert = require('assert');
const fs = require('fs');
//import models, { connectDb } from './models';
//const models,{connectDB} = require('./models');
const app = express();
//const router = express.Router();

app.set('view engine','ejs');///ejs view engine
app.use(express.json());
app.use(express.urlencoded());
app.use( express.static( "public" ) );

function transformToArrayImageInfo(imageInfo){
    let array = [];
    let currentString = '';
    let alternate = 0 ; 
    let object={};
    for(let i = 0 ; i < imageInfo.length ; i ++ ){
        if(imageInfo[i]==='\n'){
            ///process
            if(alternate===0){
                object['imageUrl'] = currentString;
            }else if(alternate===1){
                object['webUrl'] = currentString;
            }else if(alternate==2){
                object['title'] = currentString;
                array.push(object);
                object={};
            }
            alternate = (alternate + 1 ) % 3 ; 
            currentString='';
        }else if(imageInfo[i]!=='\r'){
            currentString+=imageInfo[i];
        }
    }
    if(currentString!==''){
        object['title'] = currentString;
        array.push(object);
    }
    console.log(array);
    return array;
}

///imageInfo.txt loading
var path = process.cwd();
var imageInfo = fs.readFileSync(path + "\\plain_files/imageInfo.txt").toString();
//transformToArray(imageInfo);
arrayOfImages = transformToArrayImageInfo(imageInfo);

function transformToArrayNewsInfo(newsInfo,lengthOfPrefix){
    let array = [];
    let currentString = '';
    let alternate = 0 ; 
    let object={};
    object ['longSufixContent']='';
    console.log('newsInfo: ' , newsInfo);
    for(let i = 0 ; i < newsInfo.length ; i ++ ){
        if(newsInfo[i]==='}'){
            ///process
            if(alternate===0){
                object['title'] = currentString;
            }else if(alternate===1){
                object['shortPrefixContent'] = currentString;
                alternate = 2 ; 
            }else if(alternate===2){
                object['longSufixContent'] = currentString;
            }else if(alternate==3){
                object['imagePath'] = currentString;
                array.push(object);
                object={};
            }
            alternate = (alternate + 1 ) % 4 ; 
            currentString='';
        }else if(newsInfo[i]!=='\n' && newsInfo[i]!='\r'){
            currentString+=newsInfo[i];
            if(alternate===1&&(currentString.length>=lengthOfPrefix && newsInfo[i]==='.')){
                object['shortPrefixContent'] = currentString;
                currentString = ' ';
                alternate = (alternate+ 1 ) % 4 ; 
            }
        }
    }
    console.log('news info array: ',array);
    return array;
}

///newsInfo.txt loading
var newsInfo = fs.readFileSync(path + "\\plain_files/newsInfo.txt").toString();
arrayOfNewsInfo = transformToArrayNewsInfo(newsInfo,300);

function getFirst(arrayOfImages,n){
    let firstN = [];
    for(var i = 0 ; i < n ; i ++ ){
        firstN.push(arrayOfImages[i]);
    }
    return firstN;
}

function transformToArrayPeopleInfo(fileName){ 
    let array = [];
    let currentString = '';
    let alternate = 0 ; 
    let object={};
    object['moreInfo']=[];
    let peopleInfo = fs.readFileSync(path + "\\" + fileName).toString();
    //console.log('peopleInfo: ' , peopleInfo);
    for(let i = 0 ; i < peopleInfo.length ; i ++ ){
        console.log('[ith]: ', peopleInfo[i]);
        if(peopleInfo[i]==='\n'){
            ///process
            if(currentString){
                if(alternate===0){
                    object['imagePath'] =currentString;
                }else if(alternate===1){
                    object['mainInfo'] = currentString ;
                }else{
                    object['moreInfo'].push(currentString);
                }
                currentString='';
                alternate++  
            }
        }else if(peopleInfo[i]==='}'){
            object['moreInfo'].push(currentString); 
            currentString='';
            alternate = 0 ; 
            array.push(object);
            object = {};
            object['moreInfo']=[];
            first = true;
        }else if(peopleInfo[i]!='\r'){
            currentString+=peopleInfo[i];
        }
    }
    console.log('people array: ',array);
    return array;
}

///principalResearcher.txt loading
arrayOfPrincipalResearcher = transformToArrayPeopleInfo('plain_files/principalResearcher.txt');
arrayOfPostdoctoralResearcher = transformToArrayPeopleInfo('plain_files/postdoctoralAssociates.txt');

app.get('/',(req,res)=>{
    let arrayOfFilteredImages = getFirst(arrayOfImages,4);
    console.log('arrayOfFilteredImages: ', arrayOfFilteredImages);
    res.render('home.ejs',{carouselInfo:arrayOfFilteredImages,newsInfo:arrayOfNewsInfo});
});
app.get('/profile',(req,res)=>{
    res.render('profile.ejs');
});
app.get('/people',(req,res)=>{
    res.render('people.ejs',{principalResearchers: arrayOfPrincipalResearcher,postdoctoralResearchers: arrayOfPostdoctoralResearcher});
});
app.get('/research',(req,res)=>{
    res.render('research.ejs');
});
app.get('/publications',(req,res)=>{
    res.render('publications.ejs',{publications:arrayOfImages});
    //console.log(imageInfo);
});

app.listen(3000,()=>{
    console.log('Server started on port 3000');
});