var appInfo = JSON.parse(process.env.VCAP_APPLICATION || '{}');

var service_url = '{SERVICE_URL}';
var service_username = '{SERVICE_USERNAME}';
var service_password = '{SERVICE_PASSWORD}';

if (process.env.VCAP_SERVICES) {
    var services = JSON.parse(process.env.VCAP_SERVICES);
    var service_name = 'travelqa';
    if (services[service_name]) {
	var svc = services[service_name][0].credentials;
	service_url = svc.url;
	service_username = svc.username;
	service_password = svc.password;
    } else {
	console.log('Service ' + service_name + ' is not in the VCAP_SERVICES.');
    }
} else {
    console.log('No VAP_SERVICES found in ENV.');
}

console.log('Service: ' + service_username + ':' + new Array(service_password.length).join("X") + '@' + service_url);

var auth = 'Basic ' + new Buffer(service_username + ':' + service_password).toString('base64');

exports.host = process.env.VCAP_APP_HOST || 'localhost';
exports.port = process.env.VCAP_APP_PORT || 3000;
