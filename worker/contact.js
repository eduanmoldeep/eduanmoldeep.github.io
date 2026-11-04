// Cloudflare Worker: receives the portfolio contact form and sends it via Resend.
// Secrets (wrangler secret put): RESEND_API_KEY
// Vars (wrangler.toml): ALLOWED_ORIGIN, TO_EMAIL, FROM_EMAIL

const esc = (s) =>
	String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export default {
	async fetch(request, env) {
		const cors = {
			'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};
		const json = (body, status = 200) =>
			new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

		if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
		if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
		if (request.headers.get('Origin') !== env.ALLOWED_ORIGIN) return json({ error: 'Forbidden' }, 403);

		let data;
		try {
			data = await request.json();
		} catch {
			return json({ error: 'Invalid JSON' }, 400);
		}

		// Honeypot: pretend success so bots move on.
		if (data._honey) return json({ ok: true });

		const { name, email, phone, company, topic, message } = data;
		if (!name || !email || !message || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			return json({ error: 'Name, valid email and message are required' }, 400);
		}
		if (String(message).length > 5000) return json({ error: 'Message too long' }, 400);

		const html = `
			<h2>New enquiry from your portfolio</h2>
			<p><b>Name:</b> ${esc(name)}</p>
			<p><b>Email:</b> ${esc(email)}</p>
			<p><b>Phone:</b> ${esc(phone)}</p>
			<p><b>Company:</b> ${esc(company)}</p>
			<p><b>Topic:</b> ${esc(topic)}</p>
			<p><b>Message:</b></p>
			<p style="white-space:pre-wrap">${esc(message)}</p>`;

		const res = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				from: env.FROM_EMAIL,
				to: [env.TO_EMAIL],
				reply_to: email,
				subject: `New enquiry from ${String(name).slice(0, 80)}`,
				html,
			}),
		});

		if (!res.ok) return json({ error: 'Failed to send' }, 502);
		return json({ ok: true });
	},
};
