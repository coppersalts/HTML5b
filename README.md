# HTML5b
**[Play here!](https://coppersalts.github.io/HTML5b/)**

An HTML5 port of Cary Huang's flash game [BFDIA 5b](http://bfdi.tv/5b/) using only pureJS and HTML5. Everything relating to the gameplay has been implemented and the level creator has had all its major functionalities implemented. "Explore" functionality is mostly done but still experimental.

A lot of the code in here I didn't write. Since actionscript is so similar to javascript; a lot of the code was just copy-pasted from the decompiled swf with some minor reformatting.

## Running locally
You will need these installed:
- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

Instructions:

1. Go to the terminal in your text editor. If you don't have one, [Visual Studio Code](https://code.visualstudio.com/) is pretty good.
2. Clone the repository `git clone https://github.com/coppersalts/HTML5b.git`
3. Run `npm install` in the repository directory
4. Run `npm run dev` to start the dev server. This will start a dev server at http://localhost:5173/. This will also watch for changes to the source files and automatically rebuild the project.