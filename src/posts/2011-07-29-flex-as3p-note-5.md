---
layout: post 
title: Flex - AS3 Note #5
categories: flex as3
summary: Vectors are the shit.
---

Light-weight, strongly-typed arrays that don't take any crap from anyone. Once you get them working, they are a dream to work with. They offer a speed advantage of 30% over your standard arrays and are more logical data stores than the base type.

For those playing at home, here's how to instantiate a 4D int array. The secret is knowing that any container layers are typed as pointers to the next layer.

```java
      public var eVector:Vector.<Vector.<Vector.<int>>> = new Vector.<Vector.<Vector.<int>>>(MAXNOFSTAGES);  
  
  
         for(i=0;i<MAXNOFSTAGES;i++){
  
          eVector[i] = new Vector.<Vector.<int>>(3);
  
          for(var j:int =0;j<3;j++){
  
           if(j<2){
  
            eVector[i][j] = new Vector.<int>(noOfEvents);
  
            for(var k:int =0;k<noOfEvents;k++){
  
             if(j==0){
  
              eVector[i][j][k] = eventDetailsVector[k];
  
              trace(eVector[i][j][k]);
  
             }
  
             if(j==1){
  
              eVector[i][j][k] = eventTypeVector[k];
  
              trace(eVector[i][j][k]);
  
             }      
  
           }
  
           }else{
  
            eVector[i][j] = new Vector.<int>(MAXNOFSTAGES);
  
            for(k=0;k<MAXNOFSTAGES;k++){
  
             eVector[i][j][k] = numEventVector[k]; 
  
             trace(eVector[i][j][k]);
  
            }
  
           }
  
          }
  
         }
```

[Gist](https://gist.github.com/htmldrum/2382166f028c8ff7ee44)         
