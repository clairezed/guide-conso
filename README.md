# Guide Conso

This repo is a *formation infusion* between [Claire](https://github.com/clairezed) and [David](https://github.com/DavidBruant)

[Details of this infusion (French)](infusion.md)

Branch GAS-test-push : this branch purpose is to give a deletable branch to test commiting and pushing files from Google Apps Script to github.

## Getting Started

### Installing

```
git clone git@github.com:clairezed/guide-conso.git
cd guide-conso
npm install
```

### Running

Launches a web server on [localhost:3000](localhost:3000)

```
npm start
```

### Development scripts

Before running any development scripts, be sure to first install the dev modules.

```
npm install --save --only=dev
```

### Updating Google Apps scripts

This project is synchronised with a google spreadsheet modified with apps scripts. The scripts used are versionned in current repository thanks to [clasp](https://github.com/google/clasp).

To pull the scripts from google scripts console : 

``` 
cd appscripts
clasp pull
```

To push it : 
``` 
cd appscripts
clasp push
```


#### Linting 

There's a specific lint config for appscripts directory.

The following command runs eslint for the whole project.

```
npm run lint
```  

## Language

English