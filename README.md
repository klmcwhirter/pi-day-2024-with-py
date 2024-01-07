# &pi; pi-day-2024-with-py

##### Table of Contents

- [Overview](#overview)
- [Branches](#branches)
- [Run it](#run-it)

---

## Overview

In spirit, this is just a reimplementation of [pi-day-2021-with-py](https://github.com/klmcwhirter/pi-day-2021-with-py). But it is, oh, so much more than that.

See the master branch for more ...

## Branches
This repo has multiple branches depicting different stages of development.

Branch|Contains
------|--------
master|Most current development work
`without-pyodide`|Removed all python, tinygo and zig code; single wasm produced by AssemblyScript; Python generates pi_digits_seed.ts during build. This is the most performant, but this is "Pi day with Py" so leaving Python in master ;)
without-wasm|No wasm component at all; all in Typescript; Python generates pi_digits_seed.ts during build
python-generated|State of code after moving to generate pi_30000.py as Python code
python-only|Right before moving to generate pi_30000.py during build; all calcs still in Python

### Features per branch
The master branch has the most flexibility in that it allows technologies to be swapped by chnging the dockerfile reference in `docker-compose.yml`. But that option is not available in the other branches.

Branch|Feature
------|-------
master|Containerfile_as, Containerfile_tinygo, Containerfile_zig
`without-pyodide`|Containerfile
without-wasm|Containerfile
python-generated|Dockerfile
python-only|Dockerfile

## Run it

### Uses Docker as the only dependency ...

The build and deployment process relies on Docker and docker-compose. But those are the only dependencies (aside from an internet connection).

Just run `docker-compose up` and open [http://localhost:9000/](http://localhost:9000/) in a browser.

The build process takes a little less than 3 mins on my laptop. So be patient before clicking on the link above.

You will see output like the following when it is done building and is ready for the browser:

```
podman start -a pi-day-2024-with-py_piday2024_1
[piday2024] | 
[piday2024] | > vite-template-solid@0.0.0 start
[piday2024] | > vite
[piday2024] | 
[piday2024] | 
[piday2024] |   VITE v4.5.0  ready in 437 ms
[piday2024] | 
[piday2024] |   ➜  Local:   http://localhost:9000/
[piday2024] |  ...
```

Hit CTRl-C in the terminal where `docker-compose up` was executed to exit.

Then run `docker-compose down`.
If you have no other docker images that you want to keep then run this to finish the clean up: `docker system prune -af`.

### NixOS Flakes
If you are uing the nix package manager with flakes enabled, then simply doing the following will setup the environment and output a reminder of next steps.

> The next steps reminders assume you are running nixos in a VM like I am.

`$ nix develop`

### podman

 By the way, yes, podman-compose works as well.
 To run do: `podman-compose up`.

 When ready to exit hit CTRL-C as with docker.

 Use `podman-compose down -t 0` to expedite the shutdown process. The default is to timeout in 10 secs.

 To clean up do `podman system prune -af`.
