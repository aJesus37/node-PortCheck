# node-PortCheck
node cli tool to check if a given port is open on a host or network

## Building
To get the final binaries, I'm using the [nexe](https://github.com/nexe/nexe) tool. You can install it with `npm install -g nexe` (may required administrative rights).
To build, issue the following commands:

```shell
cd <path_to_project>
npm install --no-bin-links
nexe -r node_modules -t <platform>-<arch>-12.14.1 -o <name_to_output>
```

The value of `<platform>` can be **win**, **linux** or **macos**/**darwing** (in the last, arch not required).

The value of `<arch>` can be either **x86** or **x64**.
