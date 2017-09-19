---
layout: post 
title: Flex Builder 3 Error Occured While Packaging The Application
categories: flex as3
summary: Hopefully this can prevent too many developers pulling there hair out over the finer details of Flex Builder 4.5
---
Hopefully this can prevent too many developers pulling there hair out over the finer details of Flex Builder 4.5

Should you generate this error:
`    Error Occured While Packaging The Application - Input Line Is Too Long`
And you're working from a plain vanilla installation of FB 4-4.5, perform the following:
1. Go: Project > Proprties > ActionScript Build Packaging > (Select your relevant package)
2. Review this package for files you don't need.
3. Untick them for the export build
4. Repackage.