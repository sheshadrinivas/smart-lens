import time

import colorama


def string_print(string_, time_, color_):
    for i in range(len(string_)):
        print(f"{color_}{string_[i]}", end="")
        time.sleep(time_)


colorama.init(autoreset=True)
string_print(
    "Follow the commands down, Then press control+shift for text-mode if you want to activate vioce controlled mode press shift+🎙️. the 🎙️ button on mac is the f5 key.",
    0.05,
    colorama.Fore.BLACK,
)
