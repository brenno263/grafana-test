import express from 'express';
import { collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics();

const app = express();
let statefulNumber = 1;
let vector = [];

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.get('/norm/:size', (req, res) => {
	let size = req.params.size;
	vector = [];
	for(let i = 0; i < size; i++) {
		vector.push(i);
	}
	let sqSum = 0.0;
	for(let i = 0; i < size; i++) {
		sqSum += vector[i];
	}

	let norm2 = Math.sqrt(sqSum);

	for(let i = 0; i < size; i++) {
		vector[i] /= norm2;
	}

	res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ norm: norm2 , startValue: vector[0], endValue: vector[size - 1]}));
})

app.use(express.static('./public', {
	extensions: 'html',
}))

app.listen(4001, '0.0.0.0');
