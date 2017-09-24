# Slide notes

## Who Am I?
### Slide 1
- Maxwell Forest - check us out
- We work in the B2B space with clients througout Europe, North and South America and through Asia
- Products range from bluetooth tracking hardware and software in insurance to shopping assistants for desktop and mobile

## Fastlane is a tool that helps you build iOS and Android apps reliably
### Slide2
- Doesn't replace Maven or Xcode
  - Fastlane works with the existing suite of tools for building
  - Provides sane defaults for command line compilation, plumbing commands between applications for releases and automation of repetitive tasks like app archive distribution and app store submission
- Helps you when you run into problems releasing mobile apps - (SPOILER) you will
  - The biggest pain point for new iOS developers is largely around code signing and distribution guidelines
  - You're working with a closed-source tool with frequently unclear or esoteric requirements
  - When you do run into problems, there's no central place to go to get help
    - Have to type arcane strings into Google and end up on StackOverflow pages where there's like 7 pieces of advice telling you 9 different things and none of them work
    - Fastlane uses GitHub to aggregate errors and give developers a central place to cobble together a solution
      - Because everyone is using the same tools, everyone's solution is frequently going to be the same.
- Build pipeline for iOS/Android
  - Structure around Gradle scripts
- Open Source on top of closed source
  - Makes open what it can
  - No need to remember complex compiler inputs
  - Provides tooling above what Apple offers

## THIS IS A RUBY MEET UP
### Slide 3
- Whilst this tool is for developers of iOS and Android apps - it will save your ass if you ever have to set up CI/CD tooling for them. Those developers often have their own business to worry about or punt 'scripting' to Ruby developers
- By following the approach layed out by Fastlane you can get a manageable pipeline for building iOS and Android applications
- You can avoid having to roll your own
  - We underestimate the cost of maintenance and feature creep
- Easier to just specify your build in YAML than setting up your own frameworks for continuous delivery of Android and iOS projects that may or may not be platform dependent
- I think this meet up is also at some level about working with Open Source. This is an example of how Open Source can make working with closed source projects easier

## The Problem
### Slide 4
Build tools are hard. Comes with a lot of expectations around:
- Where they will work
  - Virtualized environment / Desktop
  - What libraries they depend on
  - Complicated by platform lock-in
    - iOS depends on xcode tooling
    - Android less so but gradle / Maven are still very complicated
- What they will do
  - Code signing
  - Release management
  - Testing
  - Deployment
  - Notification
- Don't want to have to reinvent the wheel every time
  - Slack notifications / Jira transitions just require credentials

## The Solution
### Slide 5
So what does Fastlane do
    - Connect all build tools together
      - Instead of having to roll your own bash script mafia, it provides a framework to unify your workflows
      - `fastlane actions`
    - Define multiple lanes for different needs
      - The fastlane configuration file reads like a Makefile
        - Go through the default Fastfile
    - Continuous Integration Support for any platform
      - Most platforms come with a Ruby environment - or its easy enough to provision
    - Extend by adding your own build steps
    - Deploy from any computer
      - Submit to app store
      - Match is a framework for storing provisioning profiles, distribution and development certificates in source control
    - Release new app updates with the push of a button

## Components
### Slide 6
These are the components of the Fastlane ecosystem.
Som cool ones:
- Snapshot
  - Ties screenshotting into your UI tests to output screenshots on each test run
- FrameIt
  - Puts device screenshots into appropriate iOS devices
- Match
  - Manages team signing credentials in Git
- Precheck
  - Runs community-defined tests over your bundle prior to app store submission to detect potential reasons for rejection prior to submission

## iOS Example
### Slide 7
- Go through example app
- Show tests
- Show Fastfile / Appfile
