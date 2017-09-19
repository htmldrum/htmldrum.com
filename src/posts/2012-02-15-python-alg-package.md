---
layout: post 
title: Algorithms implemented in python
categories: python algorithms
summary: Ahead of some interviews I've implemented some common datastructures and algorithms in python
---
Frequently used [data structures and algorithms in python](https://github.com/htmldrum/PythonAlgPackage).

{%highlight python %}
"""
    Author: James Meldrum
    Date: Feb 13, 2010
    Lang: Python 2.7
    Desc: Implementation of a queue 

"""

class ListQueue(object):
  '''
  classdocs
  '''

  def __init__(self):
      '''
      Constructor
      '''
      self._theItems = list()
      self._length = 0
      
  def isEmpty(self):
      return self._length != 0
  
  def __len__(self):
      return self._length
  
  def enqueue(self,item):
      self._theItems.append(item)
      self._length += 1
      
  def dequeue(self):
      assert not self._length == 0, "Cannot dequeu from an empty list"
      self._theItems.pop(0)
      self._length -=1
        
class ArrayQueue(object):
  def __init__(self,size):
      self._theItems = list()
      self._count = 0
      self._max = size
      self._frontRef = None
      self._backRef = None
      
  def isEmpty(self):
      return self._count == 0
  
  def __len__(self):
      return self._count
  
  def enqueue(self,item):
      assert self._thecount <= self._max, "Circular queue is full"
      self._theItems[self._count] = item
      self._count += 1
      
  def dequeue(self):
      assert self._theCount >= 0, "Cannot dequeue empty array"
      self._theItems[self._thecount] = None
      self._count -=1

class LlistQueue(object):
  def __init__(self):
      self._qHead = None
      self._qTail = None
      self._count = 0
      
  def isEmpty(self):
      return self.qHead is None
  
  def __len__(self):
      return self._count
  
  def enqueue(self,item):
      node = _QueueNode(item)     # 
      if self.isEmpty():          # Special case if statement
          self._qHead = node 
      else:
          self._qTail.next = node # Set the currently last element to reference
                                  # the new node
      self._qTail = node
      self._count +=1
      
  def dequeue(self):
      assert not self.isEmpty(), "Cannot dequeue from empty queue"
      node = self._qHead
      if self._qHead is self._qTail:
          self._qTail = None
      self._qHead = self._qHead.next
      self._count -=1
      return node.item    
    
class _QueueNode(object):
  def __init__(self,item):
    self.item = item
    self.next = None
{% endhighlight %}

**Update 26/6/2016:** Added an example here.