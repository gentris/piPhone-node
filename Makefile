SHELL := /bin/bash

NVM_DIR ?= $(HOME)/.nvm
PYENV_DIR ?= $(HOME)/.pyenv

REPO_URL ?= https://github.com/gentris/piPhone-node
REPO_DIR ?= $(HOME)/piPhone-node

PYTHON_VERSION ?= 3.8.18
NODE_VERSION ?= 8

.PHONY: dependencies install run sync

dependencies:
	sudo apt-get update
	sudo apt-get install -y \
		tmux \
		git \
		build-essential \
		libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev \
		libffi-dev liblzma-dev \
		libncursesw5-dev xz-utils \
		tk-dev uuid-dev \
		wget curl ca-certificates \
		libgdbm-dev libnss3-dev

	@# Install nvm if missing
	@if [ ! -d "$(NVM_DIR)" ]; then \
		curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash; \
	else \
		echo "nvm already installed at $(NVM_DIR)"; \
	fi

	@# Install pyenv if missing
	@if [ ! -d "$(PYENV_DIR)" ]; then \
		curl -fsSL https://pyenv.run | bash; \
	else \
		echo "pyenv already installed at $(PYENV_DIR)"; \
	fi

	@# Persist pyenv init in ~/.bashrc (so it's available in new terminals)
	@grep -q 'export PYENV_ROOT="$$HOME/.pyenv"' "$$HOME/.bashrc" || echo 'export PYENV_ROOT="$$HOME/.pyenv"' >> "$$HOME/.bashrc"
	@grep -q 'export PATH="$$PYENV_ROOT/bin:$$PATH"' "$$HOME/.bashrc" || echo 'export PATH="$$PYENV_ROOT/bin:$$PATH"' >> "$$HOME/.bashrc"
	@grep -q 'eval "$$(pyenv init -)"' "$$HOME/.bashrc" || echo 'eval "$$(pyenv init -)"' >> "$$HOME/.bashrc"

	@# Install Node version (via nvm)
	@bash -lc 'source "$(NVM_DIR)/nvm.sh" && nvm install $(NODE_VERSION) && nvm alias default $(NODE_VERSION)'

	@# Install Python version (via pyenv)
	@bash -lc 'export PYENV_ROOT="$(PYENV_DIR)"; export PATH="$$PYENV_ROOT/bin:$$PATH"; eval "$$(pyenv init -)"; pyenv install -s $(PYTHON_VERSION)'

	@echo ""
	@echo "Done. Open a NEW terminal (or run: source ~/.bashrc) to have pyenv/nvm always available."

install:
	@# Clone or update repo
	@if [ -d "$(REPO_DIR)/.git" ]; then \
		echo "Repo already exists, updating: $(REPO_DIR)"; \
		cd "$(REPO_DIR)" && git pull --ff-only; \
	else \
		echo "Cloning into: $(REPO_DIR)"; \
		git clone "$(REPO_URL)" "$(REPO_DIR)"; \
	fi

	@# Set local Python in the repo (creates/updates .python-version)
	@bash -lc 'cd "$(REPO_DIR)" && \
		export PYENV_ROOT="$(PYENV_DIR)"; export PATH="$$PYENV_ROOT/bin:$$PATH"; eval "$$(pyenv init -)"; \
		pyenv local $(PYTHON_VERSION)'

	@# Use Node and install npm deps (and point node-gyp/npm at the pyenv Python)
	@bash -lc 'cd "$(REPO_DIR)" && \
		export PYENV_ROOT="$(PYENV_DIR)"; export PATH="$$PYENV_ROOT/bin:$$PATH"; eval "$$(pyenv init -)"; \
		PY_BIN="$$(pyenv which python)"; echo "Using Python for node-gyp: $$PY_BIN"; \
		source "$(NVM_DIR)/nvm.sh" && nvm use $(NODE_VERSION) && \
		npm config set python "$$PY_BIN" && \
		npm install --loglevel silly'

run:
	@bash -lc 'cd "$(REPO_DIR)" && source "$(NVM_DIR)/nvm.sh" && nvm use $(NODE_VERSION) && sudo "$$(which node)" index.js'

sync:
	rsync -av --delete \
	--exclude='.git/' \
	--exclude='node_modules/' \
	./ pi@192.168.100.179:~/piPhone-node/
