---
layout : post 
title: GAE Dev Note
categories: python GAE object-oriented databases
summary: Notes on Google App Engine development
---
GAE is my first experience with object-oriented databasing. The documentation from Google is poor when it comes to the specific workings of keys. As I don't have time to filter through the source code, I'm spending the day reading O'Reily's Programming Google Apps Engine. My impression of the book so far is that it neither teaches how to use the app engine in Java or Python but in some inbred, attic-baby combo. It's horrid. That said, I'm enjoying Python. Some notes:

1. You need to use Datastore Transactions to manage your commits
2. Transactions will not allow changes on entities not in the same Entity Group
3. Root entities belong to separate Entity Groups
4. Place all your kinds within a parent group to avoid spending 2 hours retooling your dataset

**Update 6/26/2016**: Merged 2 posts into one.