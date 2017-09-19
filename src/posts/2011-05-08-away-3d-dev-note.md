---
layout: post 
title: Away 3D dev note
categories: flex as3

summary: In 56 minutes I'll be starting Ludum Dare 48
---
I've been working with an AS3 3D lib called Away 3D. It's promising to optimize the FP11 Molehill API's as soon as they're released so I'm using them in some simple animations. That said, there's lots of issues. For example, it's impossible to skin cube primitives by side. To get around this I've implemented the following code which will let you do this by utilising plane objects.

{% highlight actionscript %}package com.jrm.ld
{
     import away3d.containers.ObjectContainer3D;
     import away3d.containers.View3D;
     import away3d.materials.AnimatedBitmapMaterial;
     import away3d.materials.BitmapMaterial;
     import away3d.materials.LayerMaterial;
     import away3d.materials.TransformBitmapMaterial;
     import away3d.primitives.Cube;
     import away3d.primitives.Plane;
     import flash.display.Bitmap;
     import flash.display.BitmapData;
     import flash.display.Graphics;
     import flash.display.Sprite;
     import flash.events.Event;
     import flash.events.MouseEvent;
     import flash.geom.Matrix;
     import flash.geom.Vector3D;
     import flash.text.TextField;
     import flash.text.TextFieldAutoSize;
     import flash.text.TextFormat;

     public class CubeEx5 extends Sprite
     {
          public var bg:Sprite = new Sprite;  
          public var view:View3D;
          public var w:int = 300;
          public var h:int = 100;
          public var origin:Vector3D = new Vector3D(0,0,0);
          public var cCont:ObjectContainer3D = new ObjectContainer3D;
          public var c1:away3d.primitives.Plane;
          public var c2:away3d.primitives.Plane;
          public var c3:away3d.primitives.Plane;
          public var c4:away3d.primitives.Plane;
          public function CubeEx5()
          {
               init3D();
               initBMP();
               //this.addEventListener(MouseEvent.CLICK,cloop);
               this.addEventListener(Event.ENTER_FRAME,floop);
          }

          private function init3D():void
          {
               view = new View3D({x:250,y:250});
               addChild(view);
               c1 = new Plane({name:"c1",segmentsW:2,segmentsH:2,width:w,height:h,x:0,y:0,z:0,bothsides:true});
               //c1.invertFaces();
               c2 = new Plane({name:"c2",segmentsW:2,segmentsH:2,width:w,height:h,x:0,y:h/2,z:0,bothsides:false});
               c3 = new Plane({name:"c3",segmentsW:2,segmentsH:2,width:w,height:h,x:0,y:0,z:0,bothsides:true});
               //c3.invertFaces();
               c4 = new Plane({name:"c4",segmentsW:2,segmentsH:2,width:w,height:h,x:0,y:h/2,z:0,bothsides:false});
               c3.rotationX = 90;
               c4.rotationX = 90;
               c3.y = h/4;
               c3.z = h/4;
               c4.y = h/4;
               c4.z = -h/4;
               cCont.addChild(c1);
               cCont.addChild(c2);
               cCont.addChild(c3);
               cCont.addChild(c4);
               cCont.centerPivot();
               c1.rotate(new Vector3D(0,0,0),180);
               c3.rotate(new Vector3D(0,0,0),180);
               c1.rotate(new Vector3D(0,0,h),180);
               c3.rotate(new Vector3D(0,0,h),180);
               view.scene.addChild(cCont);
               view.render();
          }

          private function initBMP():void{
               /*var cTextFormat:TextFormat = new TextFormat();
               cTextFormat.font = "Myriad Pro";
               cTextFormat.color = 0xF2F2F2;
               cTextFormat.size = 90;*/
               var cText:TextField = new TextField();
               //cText.setTextFormat(cTextFormat);
               cText.width = w;
               cText.height = h;
               var cMatrix:Matrix = new Matrix;
               /*cMatrix.tx = w/2;
               cMatrix.ty = h/2;
               */

               cText.text = "First side";
               var c4BPData:BitmapData = new BitmapData(w,h,false,0x1FFFFF);
               c4BPData.draw(cText,cMatrix);
               c4.material = new TransformBitmapMaterial(c4BPData);
               cText.text = "Second side";
               var c2BPData:BitmapData = new BitmapData(w,h,false,0x1FFFFF);
               c2BPData.draw(cText,cMatrix);
               c2.material = new TransformBitmapMaterial(c2BPData);
               cText.text = "Third side";
               var c3BPData:BitmapData = new BitmapData(w,h,false,0x1FFFFF);
               c3BPData.draw(cText,cMatrix);
               c3.material = new TransformBitmapMaterial(c3BPData);
               cText.text = "Fourth side";      
               var c1BPData:BitmapData = new BitmapData(w,h,false,0x1FFFFF);
               c1BPData.draw(cText,cMatrix);
               c1.material = new TransformBitmapMaterial(c1BPData);
               view.render();
          }

          public function cloop(e:Event):void{
               cCont.rotationX+=90;
               view.render();
          }

          public function floop(e:Event):void{
               cCont.rotationX+=3;
               view.render();
          }
     }
}  
{% endhighlight %}