![Logo](admin/mercury.png)
# ioBroker.mercury

[![NPM version](http://img.shields.io/npm/v/iobroker.mercury.svg)](https://www.npmjs.com/package/iobroker.mercury)
[![Downloads](https://img.shields.io/npm/dm/iobroker.mercury.svg)](https://www.npmjs.com/package/iobroker.mercury)
[![Dependency Status](https://img.shields.io/david/instalator/iobroker.mercury.svg)](https://david-dm.org/instalator/iobroker.mercury)
[![Known Vulnerabilities](https://snyk.io/test/github/instalator/ioBroker.mercury/badge.svg)](https://snyk.io/test/github/instalator/ioBroker.mercury)

[![NPM](https://nodei.co/npm/iobroker.mercury.png?downloads=true)](https://nodei.co/npm/iobroker.mercury/)

**Tests:** [![Travis-CI](http://img.shields.io/travis/instalator/ioBroker.mercury/master.svg)](https://travis-ci.org/instalator/ioBroker.mercury)

## Mercury adapter for ioBroker

Receiving data from electricity meters Mercury.
Supports TCP / IP and Serial connections.

The following electricity meters are supported:
* Mercury-200
* Mercury-201
* Mercury-206
* Mercury-203
* Mercury-203.2TD
* Mercury-204
* Mercury-208
* Mercury-230
* Mercury-231
* Mercury-233
* Mercury-234
* Mercury-236
* Mercury-238

## Objects
**RAW** - sending a  RAW command and receiving a response.  
Command without address and CRC, bytes separated by space. Expample:  
For 1 phase counter - Reading energy for the current month
```
32 0F
```
Returns a buffer as a string    
```"{"type":"Buffer","data":[0,14,31,155,41,3,5,177,243]}"```

## Changelog

### 0.0.3
* (instalator) added object send RAW command
* (instalator) refactor and fix error

### 0.0.2
* (instalator) added serial connect
* (instalator) fixed many error

### 0.0.1
* (instalator) initial release