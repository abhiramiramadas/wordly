**Wordle Game**
===============

* * * * *

A **desktop** implementation of the popular **word-guessing game Wordle**, built using **Electron**. Players must **guess a 5-letter English word** in up to **six attempts**, with **color-coded feedback** showing correct letters and positions. The game features a **clean UI**, **real-time word validation** via the **Datamuse API**, and **offline support** with a fallback word list.

* * * * *

**Features**
------------

-   **Gameplay**:

    -   Guess a **5-letter English word** in **six tries**.

    -   Feedback: **Green** (correct letter, correct position), **Yellow** (correct letter, wrong position), **Gray** (letter not in word).

-   **Word Validation**:

    -   Ensures guesses are **valid 5-letter English words** using the **Datamuse API**.

    -   Caches words for **faster validation**.

-   **Offline Support**:

    -   Uses a **hardcoded word list** (apple, grape, etc.) when internet is unavailable.

-   **User Interface**:

    -   **Responsive grid** for guesses.

    -   **Input field** with **autofocus** and clear **cursor feedback**.

    -   **Modal dialogs** for win, loss, and error messages.

    -   **Start New Game** and **Submit Guess** buttons.

-   **Cross-Platform**:

    -   Runs on **Windows**, **macOS**, and **Linux** via **Electron**.

* * * * *

**Screenshots**
---------------

![image](https://github.com/user-attachments/assets/7a9b2f4a-345f-4677-aca8-83993f27f96a)
![image](https://github.com/user-attachments/assets/0bb92d85-8f18-4026-9a95-eae07993ee24)



* * * * *

**Prerequisites**
-----------------

-   **Node.js** (**v16** or later recommended)

-   **npm** (included with **Node.js**)

-   **Internet connection** (for **word fetching/validation**; **offline mode** available)

* * * * *

**Installation**
----------------

1.  **Clone the Repository** (or download the project files):

    ```
    git clone <repository-url>
    cd wordle-game
    ```

2.  **Install Dependencies**:

    ```
    npm install
    ```

    Installs **Electron** and dependencies from package.json.

3.  **Run the Application**:

    ```
    npm start
    ```

    Launches the game in an **Electron window**.

* * * * *

**Usage**
---------

1.  **Start the Game**:

    -   The game starts with a **random 5-letter English word**.

    -   The **input field** is focused for your first guess.

2.  **Make a Guess**:

    -   Enter a **5-letter word**.

    -   Click **Submit Guess** or press **Enter**.

    -   The **grid** shows **color-coded feedback**.

3.  **Validation**:

    -   Only **valid English words** (e.g., apple, grape) are accepted.

    -   **Nonsense words** (e.g., qwxyz) or invalid inputs (e.g., 12345) show a **modal error**.

4.  **Win or Lose**:

    -   Guess correctly in **six tries** to win (**modal**: "You won!").

    -   Fail after **six tries** to lose (**modal**: "Game over! The word was [word]").

    -   A **new game** starts automatically after win/loss.

5.  **Start a New Game**:

    -   Click **Start New Game** to reset and begin anew.

6.  **Debugging**:

    -   Open **DevTools** (**Ctrl+Shift+I** or uncomment win.webContents.openDevTools() in main.js) to view **console logs**.

* * * * *

**Project Structure**
---------------------

```
wordle-game/
├── index.html        # **HTML** with game UI and modal
├── renderer.js       # **Game logic**, word validation, UI updates
├── style.css         # **Styles** for grid, input, buttons, modal
├── main.js           # **Electron** main process config
├── preload.js        # **Preload** script for context isolation
├── package.json      # **Metadata** and dependencies
└── package-lock.json # **Dependency** lock file
```

* * * * *

**Technical Details**
---------------------

-   **Electron**: Built with **Electron v25.0.0** for **cross-platform** support.

-   **Security**:

    -   nodeIntegration: false and contextIsolation: true for a **secure renderer**.

    -   Minimal preload.js exposes no APIs.

-   **Word Source**:

    -   **Primary**: **Datamuse API** (https://api.datamuse.com/words?sp=?????&max=1000) for random words.

    -   **Validation**: **Datamuse API** (sp=<guess>) with caching.

    -   **Fallback**: Hardcoded list (apple, grape, lemon, mango, berry, peach, melon) for **offline mode**.

-   **Validation**:

    -   Guesses must be **5 letters**, **a-z only**, and **valid English words**.

    -   **Cached** words improve performance.

    -   **Offline** guesses use the hardcoded list.

-   **UI**:

    -   **Modal dialogs** replace native alert() for better **focus management**.

    -   **Input** uses autofocus, caret-color, and :focus styles.

-   **Dependencies**:

    -   package.json: electron@^25.0.0 (**devDependency**).

    -   No **runtime dependencies**.

* * * * *

**Development**
---------------

To modify or extend the game:

1.  **Edit Logic**: Update renderer.js for gameplay changes (e.g., new rules).

2.  **Style UI**: Modify style.css for visual tweaks (e.g., colors).

3.  **Debug**: Use **DevTools** for **console logs** (word fetching, validation).

4.  **Add Word List**:

    -   Create a words.json with 5-letter words.

    -   Update preload.js and main.js for **IPC**.

    -   Modify renderer.js to use the list.

5.  **Build for Distribution**:

    ```
    npm install -g electron-packager
    electron-packager . wordle-game --platform=win32 --arch=x64 --out=dist
    ```

    Use darwin (macOS) or linux as needed.

* * * * *

**Known Limitations**
---------------------

-   **API Dependency**: **Datamuse API** may add **latency** (~100-500ms). **Caching** helps.

-   **Small Offline List**: Hardcoded list is **limited** (7 words).

-   **No Animations**: UI is **functional** but lacks **animations**.

* * * * *

**Future Improvements**
-----------------------

-   Add a **larger local word list** for **offline play**.

-   Implement **animations** for guesses and modals.

-   Add a **virtual keyboard** (like official **Wordle**).

-   Include **game statistics** (e.g., win streak).

-   Support **custom themes** (e.g., **dark mode**).

* * * * *

**Troubleshooting**
-------------------

-   **Game Doesn't Start**:

    -   Run npm install.

    -   Check **DevTools** for **errors** (e.g., API issues).

-   **Input Not Focusable**:

    -   Verify style.css has caret-color and pointer-events.

    -   Check **console** for "input focused" logs.

-   **Nonsense Words Accepted**:

    -   Ensure renderer.js has validateWord().

    -   Test **API connectivity**; check **validation logs**.

-   **Modal Issues**:

    -   Confirm index.html has **modal** <div>.

    -   Verify style.css has **modal styles**.

* * * * *

**Contributing**
----------------

Contributions are welcome! To contribute:

1.  **Fork** the repository.

2.  Create a **feature branch** (git checkout -b feature-name).

3.  **Commit** changes (git commit -m "Add feature").

4.  **Push** to the branch (git push origin feature-name).

5.  Open a **pull request**.

* * * * *

**License**
-----------

This project is licensed under the **MIT License**. See **LICENSE** for details.

* * * * *

**Acknowledgments**
-------------------

-   Inspired by **Wordle**

-   Powered by **Electron** and **Datamuse API**
