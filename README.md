# TERANGA Code Editor (PING project Lyon17 Group)

TERANGA is an advanced web-based editor designed for streamlined coding and file management. It supports multiple programming languages and features integrated tools for encryption, user authentication, and break management.

## Features

- **Multi-Language Support**: Edit and execute Python and Java code.
- **File Management**: Create, delete, and organize files and directories.
- **Real-Time Code Execution**: Run code and view outputs directly within the browser.
- **Encryption**: Secure your code by encrypting content with emojis.
- **User Authentication**: Manage user sessions with comprehensive login/logout capabilities.
- **Break Time Scheduler**: Promote healthy work habits with customizable break reminders.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your machine. 

### Installation

1. Clone the repository:

```sh
git clone https://github.com/Gelixxel/PING-Lyon17.git
```

2. Navigate to the project directory:

```sh
cd PING-Lyon17
```

3. Install the necessary packages:

```sh
cd ping-front-end
npm install
cd ..

cd ping-back-end
npm install
cd ..

cd electron
npm install
cd ..
```

4. Start the development server:

```sh
./build.sh
java -jar ping-back-end/target/ping-back-end-1.0-SNAPSHOT.jar
```

## Built With

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Node.js](https://nodejs.org/en/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- [CodeMirror](https://codemirror.net/) - Versatile text editor implemented in JavaScript for the browser

## Authors

- **FLORION Thomas** - *Initial work*
- **JOUANIN Geoffroy** - *Initial work*
- **BOURLIER Lisa** - *Initial work*
- **VIDAL Chloé** - *Initial work*
- **BACHELIER Matéo** - *Initial work* - [Profile](https://github.com/Gelixxel)

## Description

To build the app run the build.sh at the root folder.
In order to build the app you'll need java jdk 17
After the build is done you can find all the files in the electron/dist folder.
There should be a setup for the installation on you OS or you can execute the binary

To see the log of the backend you can build it with the build.sh
Then you can execute the target "java -jar ping-back-end/target/ping-back-end-1.0-SNAPSHOT.jar"
Then you can go to localhost:8081 to see the IDE on your browser