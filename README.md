## Dependencies
```
sudo apt-get update
sudo apt-get install tmux -y
sudo apt-get install git -y

sudo apt install -y \
  tmux \
  git \
  build-essential make \
  libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev \
  libffi-dev liblzma-dev \
  tk-dev uuid-dev \
  libncursesw5-dev xz-utils \
  wget curl ca-certificates \
  libgdbm-dev libnss3-dev


# nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# pyenv
curl -fsSL https://pyenv.run | bash


nvm install 10
pyenv install 3.10
npm install --loglevel silly

```

## Commands to run on startup Pi startup
```
sudo iw dev wlan0 set power_save off
```

