/**
 * The keys of the keyboard.
 * Keep up with W3C standards.(https://www.w3.org/TR/2017/CR-uievents-code-20170601/)
 * @enum {number}
 */
export const Keys = {
    /** `~ on a US keyboard. This is the 半角/全角/漢字 (hankaku/zenkaku/kanji) key on Japanese keyboards. */
    Backquote: 0,
    /** Used for both the US \| (on the 101-key layout) and also for the key located between the " and Enter keys on row C of the 102-: 0, 104- and 106-key layouts. Labelled #~ on a UK (102) keyboard. */
    Backslash: 1,
    /**	Backspace or ⌫. Labelled Delete on Apple keyboards. */
    Backspace: 2,
    /** [{ on a US keyboard. */
    BracketLeft: 3,
    /** ]} on a US keyboard. */
    BracketRight: 4,
    /** : 0,< on a US keyboard. */
    Comma: 5,
    /** 0) on a US keyboard. */
    Digit0: 6,
    /** 1! on a US keyboard. */
    Digit1: 7,
    /** 2@ on a US keyboard. */
    Digit2: 8,
    /** 3# on a US keyboard. */
    Digit3: 9,
    /** 4$ on a US keyboard. */
    Digit4: 10,
    /** 5% on a US keyboard. */
    Digit5: 11,
    /** 6^ on a US keyboard. */
    Digit6: 12,
    /** 7& on a US keyboard. */
    Digit7: 13,
    /** 8* on a US keyboard. */
    Digit8: 14,
    /** 9( on a US keyboard. */
    Digit9: 15,
    /** =+ on a US keyboard. */
    Equal: 16,
    /** Located between the left Shift and Z keys. Labelled \| on a UK keyboard. */
    IntlBackslash: 17,
    /** Located between the / and right Shift keys. Labelled \ろ (ro) on a Japanese keyboard. */
    IntlRo: 18,
    /** Located between the = and Backspace keys. Labelled ¥ (yen) on a Japanese keyboard. \/ on a Russian keyboard. */
    IntlYen: 19,
    /** a on a US keyboard. Labelled q on an AZERTY (e.g.: 0, French) keyboard. */
    KeyA: 20,
    /** b on a US keyboard. */
    KeyB: 21,
    /** c on a US keyboard. */
    KeyC: 22,
    /** d on a US keyboard. */
    KeyD: 23,
    /** e on a US keyboard. */
    KeyE: 24,
    /** f on a US keyboard. */
    KeyF: 25,
    /** g on a US keyboard. */
    KeyG: 26,
    /** h on a US keyboard. */
    KeyH: 27,
    /** i on a US keyboard. */
    KeyI: 28,
    /** j on a US keyboard. */
    KeyJ: 29,
    /** k on a US keyboard. */
    KeyK: 30,
    /** l on a US keyboard. */
    KeyL: 31,
    /** m on a US keyboard. */
    KeyM: 32,
    /** n on a US keyboard. */
    KeyN: 33,
    /** o on a US keyboard. */
    KeyO: 34,
    /** p on a US keyboard. */
    KeyP: 35,
    /** q on a US keyboard. Labelled a on an AZERTY (e.g.: 0, French) keyboard. */
    KeyQ: 36,
    /** r on a US keyboard. */
    KeyR: 37,
    /** s on a US keyboard. */
    KeyS: 38,
    /** t on a US keyboard. */
    KeyT: 39,
    /** u on a US keyboard. */
    KeyU: 40,
    /** v on a US keyboard. */
    KeyV: 41,
    /** w on a US keyboard. Labelled z on an AZERTY (e.g.: 0, French) keyboard. */
    KeyW: 42,
    /** x on a US keyboard. */
    KeyX: 43,
    /** y on a US keyboard. Labelled z on a QWERTZ (e.g.: 0, German) keyboard. */
    KeyY: 44,
    /** z on a US keyboard. Labelled w on an AZERTY (e.g.: 0, French) keyboard: 0, and y on a QWERTZ (e.g.: 0, German) keyboard. */
    KeyZ: 45,
    /** -_ on a US keyboard. */
    Minus: 46,
    /** .> on a US keyboard. */
    Period: 47,
    /** '" on a US keyboard. */
    Quote: 48,
    /** ;: on a US keyboard. */
    Semicolon: 49,
    /** /? on a US keyboard. */
    Slash: 50,

    /** Alt: 0, Option or ⌥. */
    AltLeft: 51,
    /** Alt: 0, Option or ⌥. This is labelled AltGr key on many keyboard layouts. */
    AltRight: 52,
    /** CapsLock or ⇪. */
    CapsLock: 53,
    /** The application context menu key: 0, which is typically found between the right Meta key and the right Control key. */
    ContextMenu: 54,
    /** Control or ⌃. */
    ControlLeft: 55,
    /** Control or ⌃. */
    ControlRight: 56,
    /** Enter or ↵. Labelled Return on Apple keyboards. */
    Enter: 57,
    /** The Windows: 0, ⌘: 0, Command or other OS symbol key. */
    MetaLeft: 58,
    /** The Windows: 0, ⌘: 0, Command or other OS symbol key. */
    MetaRight: 59,
    /** Shift or ⇧. */
    ShiftLeft: 60,
    /** Shift or ⇧. */
    ShiftRight: 61,
    /** Space. */
    Space: 62,
    /** Tab or ⇥. */
    Tab: 63,

    /** Japanese: 変換 (henkan). */
    Convert: 64,
    /** Japanese: カタカナ/ひらがな/ローマ字 (katakana/hiragana/romaji). */
    KanaMode: 65,
    /** 
     * Korean: HangulMode 한/영 (han/yeong).
     * Japanese (Mac keyboard): かな (kana).
     * */
    Lang1: 66,
    /**
     * 	Korean: Hanja 한자 (hanja).
     *  Japanese (Mac keyboard): 英数 (eisu).
     */
    Lang2: 67,
    /** Japanese (word-processing keyboard): Katakana. */
    Lang3: 68,
    /** Japanese (word-processing keyboard): Hiragana. */
    Lang4: 69,
    /** Japanese (word-processing keyboard): Zenkaku/Hankaku. */
    Lang5: 70,
    /** Japanese: 無変換 (muhenkan). */
    NonConvert: 71,

    /** ⌦. The forward delete key. Note that on Apple keyboards: 0, the key labelled Delete on the main part of the keyboard should be encoded as "Backspace". */
    Delete: 72,
    /** Page Down: 0, End or ↘. */
    End: 73,
    /** Help. Not present on standard PC keyboards. */
    Help: 74,
    /** Home or ↖. */
    Home: 75,
    /** Insert or Ins. Not present on Apple keyboards. */
    Insert: 76,
    /** Page Down: 0, PgDn or ⇟. */
    PageDown: 77,
    /** Page Up: 0, PgUp or ⇞. */
    PageUp: 78,

    /** ↓ */
    ArrowDown: 79,
    /** ← */
    ArrowLeft: 80,
    /** → */
    ArrowRight: 81,
    /** ↑ */
    ArrowUp: 82,

    /** On the Mac: 0, the "NumLock" code should be used for the numpad Clear key. */
    NumLock: 83,
    /** 
     * 0 Ins on a keyboard.
     * 0 on a phone or remote control.
     * */
    Numpad0: 84,
    /**
     * 1 End on a keyboard.
     * 1 or 1 QZ on a phone or remote control.
     */
    Numpad1: 85,
    /**
     * 2 ↓ on a keyboard.
     * 2 ABC on a phone or remote control.
     */
    Numpad2: 86,
    /**
     * 3 PgDn on a keyboard.
     * 3 DEF on a phone or remote control.
     */
    Numpad3: 87,
    /**
     * 4 ← on a keyboard.
     * 4 GHI on a phone or remote control.
     */
    Numpad4: 88,
    /**
     * 5 on a keyboard.
     * 5 JKL on a phone or remote control.
     */
    Numpad5: 89,
    /**
     * 6 → on a keyboard.
     * 6 MNO on a phone or remote control.
     */
    Numpad6: 90,
    /**
     * 7 Home on a keyboard.
     * 7 PQRS or 7 PRS on a phone or remote control.
     */
    Numpad7: 91,
    /**
     * 8 ↑ on a keyboard.
     * 8 TUV on a phone or remote control.
     */
    Numpad8: 92,
    /**
     * 9 PgUp on a keyboard.
     * 9 WXYZ or 9 WXY on a phone or remote control.
     */
    Numpad9: 93,
    /** + */
    NumpadAdd: 94,
    /** Found on the Microsoft Natural Keyboard. */
    NumpadBackspace: 95,
    /** C or AC (All Clear). Also for use with numpads that have a Clear key that is separate from the NumLock key. On the Mac: 0, the numpad Clear key should always be encoded as "NumLock". */
    NumpadClear: 96,
    /** CE (Clear Entry) */
    NumpadClearEntry: 97,
    /** : 0, (thousands separator). For locales where the thousands separator is a "." (e.g.: 0, Brazil): 0, this key may generate a .. */
    NumpadComma: 98,
    /** . Del. For locales where the decimal separator is ": 0," (e.g.: 0, Brazil): 0, this key may generate a : 0,. */
    NumpadDecimal: 99,
    /** / */
    NumpadDivide: 100,
    /** Numpad Enter */
    NumpadEnter: 101,
    /** = */
    NumpadEqual: 102,
    /** # on a phone or remote control device. This key is typically found below the 9 key and to the right of the 0 key. */
    NumpadHash: 103,
    /** M+ Add current entry to the value stored in memory. */
    NumpadMemoryAdd: 104,
    /** MC Clear the value stored in memory. */
    NumpadMemoryClear: 105,
    /** MR Replace the current entry with the value stored in memory. */
    NumpadMemoryRecall: 106,
    /** MS Replace the value stored in memory with the current entry. */
    NumpadMemoryStore: 107,
    /** M- Subtract current entry from the value stored in memory. */
    NumpadMemorySubtract: 108,
    /** 
     * * on a keyboard. For use with numpads that provide mathematical operations (+: 0, -: 0, * and /).
     * Use "NumpadStar" for the * key on phones and remote controls.
     */
    NumpadMultiply: 109,
    /** ( Found on the Microsoft Natural Keyboard. */
    NumpadParenLeft: 110,
    /** ) Found on the Microsoft Natural Keyboard. */
    NumpadParenRight: 111,
    /**
     * * on a phone or remote control device. This key is typically found below the 7 key and to the left of the 0 key.
     * Use "NumpadMultiply" for the * key on numeric keypads.
     */
    NumpadStar: 112,
    /** - */
    NumpadSubtract: 113,

    /** Esc or ⎋. */
    Escape: 114,
    /** F1 */
    F1: 115,
    /** F2 */
    F2: 116,
    /** F3 */
    F3: 117,
    /** F4 */
    F4: 118,
    /** F5 */
    F5: 119,
    /** F6 */
    F6: 120,
    /** F7 */
    F7: 121,
    /** F8 */
    F8: 122,
    /** F9 */
    F9: 123,
    /** F10 */
    F10: 124,
    /** F11 */
    F11: 125,
    /** F12 */
    F12: 126,
    /** F13 */
    F13: 127,
    /** F14 */
    F14: 128,
    /** F15 */
    F15: 129,
    /** Fn This is typically a hardware key that does not generate a separate code. Most keyboards do not place this key in the function section: 0, but it is included here to keep it with related keys. */
    Fn: 130,
    /** FLock or FnLock. Function Lock key. Found on the Microsoft Natural Keyboard. */
    FnLock: 131,
    /** PrtScr SysRq or Print Screen. */
    PrintScreen: 132,
    /** Scroll Lock */
    ScrollLock: 133,
    /** Pause Break */
    Pause: 134,

    /** Some laptops place this key to the left of the ↑ key. */
    BrowserBack: 135,
    /** Browser Favorites */
    BrowserFavorites: 136,
    /** Some laptops place this key to the right of the ↑ key. */
    BrowserForward: 137,
    /** Browser Home */
    BrowserHome: 138,
    /** Browser Refresh */
    BrowserRefresh: 139,
    /** Browser Search */
    BrowserSearch: 140,
    /** Browser Stop */
    BrowserStop: 141,
    /** Eject or ⏏. This key is placed in the function section on some Apple keyboards. */
    Eject: 142,
    /** Sometimes labelled My Computer on the keyboard. */
    LaunchApp1: 143,
    /** Sometimes labelled Calculator on the keyboard. */
    LaunchApp2: 144,
    /** Launch Mail */
    LaunchMail: 145,
    /** Media Play/Pause */
    MediaPlayPause: 146,
    /** Media Select */
    MediaSelect: 147,
    /** Media Stop */
    MediaStop: 148,
    /** Media Track Next */
    MediaTrackNext: 149,
    /** Media Track Previous */
    MediaTrackPrevious: 150,
    /** This key is placed in the function section on some Apple keyboards: 0, replacing the Eject key. */
    Power: 151,
    /** Sleep */
    Sleep: 152,
    /** Audio Volume Down */
    AudioVolumeDown: 153,
    /** Audio Volume Mute */
    AudioVolumeMute: 154,
    /** Audio Volume Up */
    AudioVolumeUp: 155,
    /** Wake Up */
    WakeUp: 156,

    /** Hyper */
    Hyper: 157,
    /** Super */
    Super: 158,
    /** Turbo */
    Turbo: 159,

    /** Abort */
    Abort: 160,
    /** Resume */
    Resume: 161,
    /** Suspend */
    Suspend: 162,

    /** Found on Sun’s USB keyboard. */
    Again: 163,
    /** Found on Sun’s USB keyboard. */
    Copy: 164,
    /** Found on Sun’s USB keyboard. */
    Cut: 165,
    /** Found on Sun’s USB keyboard. */
    Find: 166,
    /** Found on Sun’s USB keyboard. */
    Open: 167,
    /** Found on Sun’s USB keyboard. */
    Paste: 168,
    /** Found on Sun’s USB keyboard. */
    Props: 169,
    /** Found on Sun’s USB keyboard. */
    Select: 170,
    /** Found on Sun’s USB keyboard. */
    Undo: 171,

    /** Use for dedicated ひらがな key found on some Japanese word processing keyboards. */
    Hiragana: 172,
    /** Use for dedicated カタカナ key found on some Japanese word processing keyboards. */
    Katakana: 173,

    /** This value code should be used when no other value given in this specification is appropriate. */
    Unidentified: 174,
}