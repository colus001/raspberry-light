# Raspberry Light

> Raspberry pi powered s/w stack for smart light stand

### Server

##### Dependency

```
$ npm install
```

##### Start Develop

1. Add raspberry.pi to your /etc/hosts

  ```
  192.168.31.251 raspberry.pi // your local ip
  ```

  then you can login into

  ```
  $ ssh pi@raspberry.pi
  ```

1. Use .ftpconfig as Atom `Remote FTP` plugin config example

1. Sync local -> remote

1. Start app

  ```
  $ npm start
  ```

### App

##### Dependency

```
$ npm install
```

##### Start Develop

1. Start bundling

  ```
  $ npm start
  ```

2. Run on Device using Xcode

  *BLE is disabled in iOS Simulator so you must run in Device*

### TODO

- [ ] Better pacakging
- [ ] Android instruction
