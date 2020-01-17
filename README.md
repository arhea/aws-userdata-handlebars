# UserData Powered By Handlebars

This construct enables the use of Handlebars templates as Userdata. Often times UserData scripts are long, complex, and require inserting other variables from your environment. This construct extends the base functionality of the default ec2.UserData class to include Handlebars.

## Usage

```typescript
import { HandlebarsUserData } from '@arhea/aws-userdata-handlebars';
import * as path from 'path';

// create our object
// for Windows add .forWindows() instead of .forLinux()
const webUserData = HandlebarsUserData.forLinux();

// load the template file
webUserData.addTemplateFile(path.join(__dirname, 'userdata', 'webserver.handlebars'));

// add data to the template in a key, value format
webUserData.addData('loadBalancerUrl', `http://${app.loadBalancerDnsName}`);
```

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
