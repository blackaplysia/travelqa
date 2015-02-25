var appInfo = JSON.parse(process.env.VCAP_APPLICATION || '{}');

var service_url = '{????}';
var service_username = '{????}';
var service_password = '{????}';

if (process.env.VCAP_SERVICES) {
    var services = JSON.parse(process.env.VCAP_SERVICES);
    var service_name = 'question_and_answer';
    if (services[service_name]) {
	var service_instance_name = services[service_name][0].name;
	var service_instance_plan = services[service_name][0].plan;
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

console.log(service_instance_name + '(' + service_instance_plan + '): ' + service_username + ':XXXX@' + service_url);

var auth = 'Basic ' + new Buffer(service_username + ':' + service_password).toString('base64');

exports.host = process.env.VCAP_APP_HOST || 'localhost';
exports.port = process.env.VCAP_APP_PORT || 3000;

exports.url = service_url;
exports.username = service_username;
exports.password = service_password;
exports.auth = auth;
