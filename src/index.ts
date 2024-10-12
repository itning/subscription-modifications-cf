import yaml from 'js-yaml';
import axios from 'axios';
import { handle } from './modify';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		switch (path) {
			case '/': {
				return new Response('up');
			}
			case '/json': {
				const requestUrl = url.searchParams.get('url');
				if (!requestUrl) {
					return new Response(null, { status: 400 });
				}
				const yamlResponse = await axios.get(requestUrl, {
					responseType: 'text', timeout: 5000, headers: {
						'user-agent': 'Clash.for.Windows/0.20.27'
					}
				});
				if (!yamlResponse.data) {
					return new Response('no response for url', { status: 500 });
				}
				const doc = yaml.load(yamlResponse.data);
				return new Response(JSON.stringify(doc), {
					headers: {
						'Content-Type': 'application/json'
					}
				});
			}
			case '/config': {
				const requestUrl = url.searchParams.get('url');
				if (!requestUrl) {
					return new Response(null, { status: 400 });
				}
				const yamlResponse = await axios.get(requestUrl, {
					responseType: 'text', timeout: 5000, headers: {
						'user-agent': 'Clash.for.Windows/0.20.27'
					}
				});
				if (!yamlResponse.data) {
					return new Response('no response for url', { status: 500 });
				}
				const doc = yaml.load(yamlResponse.data);
				const result = handle(doc);
				const y = yaml.dump(result);
				return new Response(y, {
					headers: { 'Content-Type': 'application/yaml' }
				});
			}
			default: {
				return new Response(null, { status: 404 });
			}
		}
	}
} satisfies ExportedHandler<Env>;
