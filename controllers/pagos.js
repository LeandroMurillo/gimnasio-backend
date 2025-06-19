const { MercadoPagoConfig, Preference } = require('mercadopago');

const mercadopago = new MercadoPagoConfig({
	accessToken: process.env.MP_ACCESS_TOKEN,
});

const crearPreferencia = async (req, res) => {
	try {
		const { titulo, precio } = req.body;

		const preference = {
			items: [
				{
					title: titulo,
					unit_price: Math.round(parseFloat(precio)),
					quantity: 1,
				},
			],
			back_urls: {
				success: 'http://localhost:5173/success',
				failure: 'http://localhost:5173/failure',
				pending: 'http://localhost:5173/pending',
			},
		};

		const { id } = await new Preference(mercadopago).create({ body: preference });
		return res.json({ id });
	} catch (error) {
		console.error('Error al crear preferencia:', error);
		return res.status(500).json({ error: 'No se pudo generar la preferencia' });
	}
};

module.exports = { crearPreferencia };
