# ioBroker Adapter Development with GitHub Copilot

**Version:** 0.4.0
**Template Source:** https://github.com/DrozmotiX/ioBroker-Copilot-Instructions

This file contains instructions and best practices for GitHub Copilot when working on ioBroker adapter development.

## Project Context

You are working on an ioBroker adapter. ioBroker is an integration platform for the Internet of Things, focused on building smart home and industrial IoT solutions. Adapters are plugins that connect ioBroker to external systems, devices, or services.

**Mercury Adapter Specific Context:**
This adapter is designed to collect data from Mercury electricity meters, which are commonly used in industrial and residential applications. The adapter supports both serial (RS-485) and TCP/IP connections to communicate with Mercury meters. Key features include:

- **Target Devices**: Mercury electricity meters (various models)
- **Connection Types**: Serial (RS-485) and TCP/IP connections
- **Data Collection**: Real-time electricity consumption, voltage, current, power, frequency
- **Protocols**: Mercury-specific communication protocols
- **Configuration**: Flexible polling intervals for different types of data
- **Multi-device Support**: Can handle multiple Mercury meters simultaneously
- **Version**: 0.2.1 (requires Node.js >= 18, js-controller >= 5)

## Testing

### Unit Testing
- Use Jest as the primary testing framework for ioBroker adapters
- Create tests for all adapter main functions and helper methods
- Test error handling scenarios and edge cases
- Mock external API calls and hardware dependencies
- For adapters connecting to APIs/devices not reachable by internet, provide example data files to allow testing of functionality without live connections
- Example test structure:
  ```javascript
  describe('AdapterName', () => {
    let adapter;
    
    beforeEach(() => {
      // Setup test adapter instance
    });
    
    test('should initialize correctly', () => {
      // Test adapter initialization
    });
  });
  ```

### Integration Testing

**IMPORTANT**: Use the official `@iobroker/testing` framework for all integration tests. This is the ONLY correct way to test ioBroker adapters.

**Official Documentation**: https://github.com/ioBroker/testing

#### Framework Structure
Integration tests MUST follow this exact pattern:

```javascript
const path = require('path');
const { tests } = require('@iobroker/testing');

// Define test coordinates or configuration
const TEST_COORDINATES = '52.520008,13.404954'; // Berlin
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

// Use tests.integration() with defineAdditionalTests
tests.integration(path.join(__dirname, '..'), {
    defineAdditionalTests({ suite }) {
        suite('Test adapter with specific configuration', (getHarness) => {
            let harness;

            before(() => {
                harness = getHarness();
            });

            it('should configure and start adapter', function () {
                return new Promise(async (resolve, reject) => {
                    try {
                        harness = getHarness();
                        
                        // Get adapter object using promisified pattern
                        const obj = await new Promise((res, rej) => {
                            harness.objects.getObject('system.adapter.your-adapter.0', (err, o) => {
                                if (err) return rej(err);
                                res(o);
                            });
                        });
                        
                        if (!obj) {
                            return reject(new Error('Adapter object not found'));
                        }

                        // Configure adapter properties
                        Object.assign(obj.native, {
                            position: TEST_COORDINATES,
                            createCurrently: true,
                            createHourly: true,
                            createDaily: true,
                            // Add other configuration as needed
                        });

                        // Set the updated configuration
                        harness.objects.setObject(obj._id, obj);

                        console.log('✅ Step 1: Configuration written, starting adapter...');
                        
                        // Start adapter and wait
                        await harness.startAdapterAndWait();
                        
                        console.log('✅ Step 2: Adapter started');

                        // Wait for adapter to process data
                        const waitMs = 15000;
                        await wait(waitMs);

                        console.log('🔍 Step 3: Checking states after adapter run...');
                        
                        // Check that required states were created
                        const states = await harness.states.getStatesAsync('your-adapter.0.*');
                        
                        if (!states || Object.keys(states).length === 0) {
                            return reject(new Error('No states were created by the adapter'));
                        }

                        console.log(`✅ Found ${Object.keys(states).length} states created by adapter`);
                        
                        // Verify specific required states
                        if (!states['your-adapter.0.info.connection']) {
                            return reject(new Error('Required state info.connection not found'));
                        }

                        resolve(true);
                    } catch (error) {
                        console.error('❌ Test failed:', error);
                        reject(error);
                    }
                });
            }).timeout(120000); // 2 minute timeout
        });
    }
});
```

## Core Adapter Structure

### Main Adapter Class
```javascript
class YourAdapter extends utils.Adapter {
    constructor(options = {}) {
        super({
            ...options,
            name: 'your-adapter',
        });
    }

    async onReady() {
        // Initialize adapter
        this.log.info('Adapter starting...');
        
        // Set up configuration
        await this.setupConfiguration();
        
        // Start main functionality
        await this.start();
    }

    async onStateChange(id, state) {
        if (state) {
            this.log.info(`State ${id} changed: ${state.val} (ack = ${state.ack})`);
            
            if (!state.ack) {
                // Handle state changes from user
                await this.handleStateChange(id, state);
            }
        } else {
            this.log.info(`State ${id} deleted`);
        }
    }

    async onUnload(callback) {
        try {
            // Clean up resources
            if (this.connectionTimer) {
                this.clearTimeout(this.connectionTimer);
                this.connectionTimer = undefined;
            }
            // Close connections, clean up resources
            callback();
        } catch (e) {
            callback();
        }
    }
}
```

## Code Style and Standards

- Follow JavaScript/TypeScript best practices
- Use async/await for asynchronous operations
- Implement proper resource cleanup in `unload()` method
- Use semantic versioning for adapter releases
- Include proper JSDoc comments for public methods

**Mercury Adapter Specific Standards:**
- Use proper serial port handling with timeout management
- Implement reconnection logic for network connections
- Handle Mercury protocol-specific error codes appropriately
- Use polling intervals efficiently to avoid overwhelming meters
- Implement proper data validation for meter readings

## CI/CD and Testing Integration

### GitHub Actions for API Testing
For adapters with external API dependencies, implement separate CI/CD jobs:

```yaml
# Tests API connectivity with demo credentials (runs separately)
demo-api-tests:
  if: contains(github.event.head_commit.message, '[skip ci]') == false
  
  runs-on: ubuntu-22.04
  
  steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Use Node.js 20.x
      uses: actions/setup-node@v4
      with:
        node-version: 20.x
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run demo API tests
      run: npm run test:integration-demo
```

### CI/CD Best Practices
- Run credential tests separately from main test suite
- Use ubuntu-22.04 for consistency
- Don't make credential tests required for deployment
- Provide clear failure messages for API connectivity issues
- Use appropriate timeouts for external API calls (120+ seconds)

### Package.json Script Integration
Add dedicated script for credential testing:
```json
{
  "scripts": {
    "test:integration-demo": "mocha test/integration-demo --exit"
  }
}
```

### Practical Example: Complete API Testing Implementation
Here's a complete example based on lessons learned from the Discovergy adapter:

#### test/integration-demo.js
```javascript
const path = require("path");
const { tests } = require("@iobroker/testing");

// Helper function to encrypt password using ioBroker's encryption method
async function encryptPassword(harness, password) {
    const systemConfig = await harness.objects.getObjectAsync("system.config");
    
    if (!systemConfig || !systemConfig.native || !systemConfig.native.secret) {
        throw new Error("Could not retrieve system secret for password encryption");
    }
    
    const secret = systemConfig.native.secret;
    let result = '';
    for (let i = 0; i < password.length; ++i) {
        result += String.fromCharCode(secret[i % secret.length].charCodeAt(0) ^ password.charCodeAt(i));
    }
    
    return result;
}

// Run integration tests with demo credentials
tests.integration(path.join(__dirname, ".."), {
    defineAdditionalTests({ suite }) {
        suite("API Testing with Demo Credentials", (getHarness) => {
            let harness;
            
            before(() => {
                harness = getHarness();
            });

            it("Should connect to API and initialize with demo credentials", async () => {
                console.log("Setting up demo credentials...");
                
                if (harness.isAdapterRunning()) {
                    await harness.stopAdapter();
                }
                
                const encryptedPassword = await encryptPassword(harness, "demo_password");
                
                await harness.changeAdapterConfig("your-adapter", {
                    native: {
                        username: "demo@provider.com",
                        password: encryptedPassword,
                        // other config options
                    }
                });

                console.log("Starting adapter with demo credentials...");
                await harness.startAdapter();
                
                // Wait for API calls and initialization
                await new Promise(resolve => setTimeout(resolve, 60000));
                
                const connectionState = await harness.states.getStateAsync("your-adapter.0.info.connection");
                
                if (connectionState && connectionState.val === true) {
                    console.log("✅ SUCCESS: API connection established");
                    return true;
                } else {
                    throw new Error("API Test Failed: Expected API connection to be established with demo credentials. " +
                        "Check logs above for specific API errors (DNS resolution, 401 Unauthorized, network issues, etc.)");
                }
            }).timeout(120000);
        });
    }
});
```

## Adapter-Specific Best Practices

### Mercury Adapter Development Guidelines

#### Serial Communication
- Always implement proper serial port cleanup in `onUnload()`
- Use timeouts for serial communication to prevent hanging
- Handle connection drops gracefully with automatic reconnection
- Implement proper baud rate and parity settings based on Mercury meter configuration

#### TCP Communication  
- Implement connection pooling for multiple meters
- Handle network timeouts appropriately
- Provide clear error messages for network-related issues
- Support both IPv4 and IPv6 connections where applicable

#### Data Processing
- Validate meter responses against Mercury protocol specifications
- Handle different Mercury meter models and their varying data formats
- Implement proper unit conversions (kWh, kW, V, A, Hz)
- Store historical data efficiently using ioBroker's state management

#### Configuration Management
- Provide clear configuration options for connection types (serial/TCP)
- Implement validation for IP addresses, ports, and serial settings
- Support multiple polling intervals for different data types
- Allow easy addition/removal of multiple meters

#### Error Handling
- Implement specific error codes for Mercury protocol errors
- Provide diagnostic information for connection troubleshooting
- Log communication attempts and responses for debugging
- Handle meter busy states and retry logic appropriately

### Mercury Protocol Implementation
```javascript
// Example of Mercury-specific communication handling
async function sendMercuryCommand(command, address) {
    try {
        const packet = buildMercuryPacket(command, address);
        const response = await this.sendWithTimeout(packet, this.config.timeoutresponse);
        
        if (!validateMercuryResponse(response)) {
            throw new Error('Invalid Mercury response format');
        }
        
        return parseMercuryData(response);
    } catch (error) {
        this.log.warn(`Mercury communication error: ${error.message}`);
        throw error;
    }
}
```