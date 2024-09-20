# Chordflip

## Overview

Chordflip allows users to simply input chords into song lyrics and be able to transpose chords conveniently

### Problem Space

Wether you are a new musician or a seasoned veteran, at some point you've had to create your own song sheet. There are a bunch of songsheet creator websites out there however, you would have to download an app or pay premiums to access the feature. Chordflip aims to make songsheet creation as easy as possible without all the hassle of signing up, downloading apps and more importantly it's free!

### User Profile

Musicians - Regardless of skill level - Looking to easily create songsheets - Easily transpose chords to different keys

### Features

- Users can easily type song lyrics
- Users can input chords on top of song lyrics
- All chords are transposable to a half step using + and - buttons
- Once user is done creating the chord sheet, they can download it as a PDF
- Chords will automatically be set to bold

## Implementation

### Tech Stack

- React
- Express
- Client libraries:
  - react
  - react-router
  - axios
  - jsPDF (allows users to generate PDFs after creating chords)
  - slate (framework for building rich text editor)
  - slate-history (provides undo and redo function to the Slate editor)
  - slate-react (makes it possible for developers to use Slate in the React app)
- Server libraries:
  - express
  - cors
  - axios
  - nodemon

### Steps to run app

#### client

1. Git clone the client repo from https://github.com/yapangelo/capstone-chordflip.git
2. Open the folder "capstone chordflip" in your code editor
3. cd into directory "angelo-capstone-chordflip"
4. npm i to install node modules
5. npm run dev to run app

#### server

1. Git clone the server repo from https://github.com/yapangelo/capstone-chordflip-api.git
2. cd into "capstone-chordflip-api" directory
3. npm i express
4. npm run dev to run server

### APIs

- https://piano-chords.p.rapidapi.com

### Piano Chords API Endpoints

**GET /chords**

- Get chords list

Response:

```
{
    "C": {...
    },
    "C#": {...
    },
    "D": {...
    },
    ...
}
```

**GET /chords/c**

- Get variations for specific chord

Parameters: - {chord} (C, C#, D, Eb, ...)

Response:

```
{
    "major": {...
    },
    "m": {...
    },
    "dim": {...
    },
    ...
}
```

**GET /chords/c/major**

- Get info on chord variation

Parameters: - {chord} (C, C#, D, Eb, ...) - {variation} (major, m, dim, 7, ...)

Response:
{
"name": "C-major",
"notes": [
"C",
"E",
"G"
],
"intervals": [
"1",
"3",
"5"
],
"midiKeys": [
60,
64,
67
]
}
