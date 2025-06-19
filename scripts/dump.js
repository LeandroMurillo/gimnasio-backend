require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const format = (argv.format || 'json').toLowerCase();

const models = {
	usuarios: require('../models/usuarios'),
	categorias: require('../models/categorias'),
	planes: require('../models/planes'),
	clases: require('../models/clases'),
	asistencias: require('../models/asistencias'),
	pagos: require('../models/pagos'),
};

(async () => {
	await mongoose.connect(process.env.MONGODB_CNN);

	const dumpDir = path.join(__dirname, 'dump');
	if (!fs.existsSync(dumpDir)) fs.mkdirSync(dumpDir);

	for (const [name, Model] of Object.entries(models)) {
		const data = await Model.find().lean();
		const file = path.join(dumpDir, `${name}.${format}`);

		if (format === 'json') {
			fs.writeFileSync(file, JSON.stringify(data, null, 2));
		} else if (format === 'csv') {
			const createCsv = require('csv-writer').createObjectCsvWriter;
			const header = Object.keys(data[0] || {}).map((k) => ({ id: k, title: k }));
			await createCsv({ path: file, header }).writeRecords(data);
		}
		console.log(`↳ ${file} (${data.length} docs)`);
	}

	mongoose.disconnect();
})();
