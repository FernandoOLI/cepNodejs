var express = require('express')
var app = express();

app.get('/', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM dados_dep ORDER BY id DESC', function (err, rows, fields) {
			if (err) {
				req.flash('error', err)
				res.render('cep/list', {
					title: 'Cep List',
					data: ''
				})
			} else {
				res.render('cep/list', {
					title: 'Cep List',
					data: rows
				})
			}
		})
	})
})
app.get('/search/(:cep)', function (req, res, next) {
	let cepV = req.sanitize('cep').escape().trim();
	let cep = cepV.replace("-", "")

	if (cep == null) {
		console.log('render null')
		res.render('cep/search', {
			title: 'Cep List',
			data: null
		})
	}
	else {
		console.log('render not null')
		req.getConnection(function (error, conn) {
			conn.query('SELECT * FROM dados_dep WHERE cep = ?',
				[req.params.cep], function (err, rows, fields) {
					if (err) {
						req.flash('error', err)
						res.render('cep/search', {
							title: 'Cep List',
							data: ''
						})
					} else {
						res.render('cep/searchresult', {
							title: 'Cep List',
							data: rows
						})
					}
				})
		})
	}
})

app.get('/add', function (req, res, next) {

	res.render('cep/add', {
		title: 'Inserir CEP',
		cep: '',
		nome: '',
		endereco: '',
		bairro: '',
		estado: '',
		cidade: ''
	})
})

app.get('/search', function (req, res, next) {

	res.render('cep/search', {
		title: 'Inserir CEP',
		cep: ''
	})
})

function validar(cep) {

	var validador = (cep.replace("-", ""));
	if (validador.length != 8) {
		return false;
	}
	else Number.isInteger(validador);
}
app.post('/add', function (req, res, next) {

	req.assert('cep', 'CEP Formato inválido').notEmpty();
	req.assert('nome', 'Nome é necessário').notEmpty();
	req.assert('endereco', 'Endereco é necessário').notEmpty();
	req.assert('bairro', 'Bairro é necessário').notEmpty();
	req.assert('estado', 'Estado é necessário').notEmpty();
	req.assert('cidade', 'Cidade é necessário').notEmpty();
	var errors = req.validationErrors();
	var validarBoolean = validar(req.sanitize('cep').escape().trim(), 'BR');

	var validarExis = req.getConnection(function validarExiste(cep, conn) {
		conn.query('SELECT * FROM dados_dep WHERE cep = ?',
			[cep], function (err, rows, fields) {
				if (err) throw err

				if (rows.length <= 0)
					return true;
				else return false;
			})
	})

	if (!errors || validarBoolean || validarExis) {
		let cepV = req.sanitize('cep').escape().trim();
		var user = {
			cep: cepV.replace("-", ""),
			nome: req.sanitize('nome').escape().trim(),
			endereco: req.sanitize('endereco').escape().trim(),
			bairro: req.sanitize('bairro').escape().trim(),
			estado: req.sanitize('estado').escape().trim(),
			cidade: req.sanitize('cidade').escape().trim()
		}

		req.getConnection(function (error, conn) {
			conn.query('INSERT INTO dados_dep SET ?', user, function (err, result) {
				if (err) {
					req.flash('error', err)
					res.render('cep/add', {
						title: 'Inserir CEP',
						cep: user.cep,
						nome: user.nome,
						endereco: user.endereco,
						bairro: user.bairro,
						estado: user.estado,
						cidade: user.cidade
					})
				} else {
					req.flash('success', 'Data added successfully!')

					res.render('cep/add', {
						title: 'Inserir CEP',
						cep: '',
						nome: '',
						endereco: '',
						bairro: '',
						estado: '',
						cidade: ''
					})
				}
			})
		})
	}
	else {
		var error_msg = ''

		if (validar)
			error_msg += 'Código inválido => error : 401<br>'

		if (validarExis)
			error_msg += 'Cep existente, por favor inserir um novo ou editar o existente <br>'
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)

		res.render('cep/add', {
			title: 'Adicionar novo CEP',
			cep: req.body.cep,
			nome: req.body.nome,
			endereco: req.body.endereco,
			bairro: req.body.bairro,
			estado: req.body.estado,
			cidade: req.body.cidade
		})
	}
})

app.get('/edit/(:cep)', function (req, res, next) {
	req.getConnection(function (error, conn) {
		conn.query('SELECT * FROM dados_dep WHERE cep = ?',
			[req.params.cep], function (err, rows, fields) {
				if (err) throw err

				if (rows.length <= 0) {
					req.flash('error', 'CEP não encontrado cep =  ' + req.params.cep)
					res.redirect('/cep')
				}
				else {
					res.render('cep/edit', {
						title: 'Edit User',
						id: rows[0].id,
						cep: rows[0].cep,
						nome: rows[0].nome,
						endereco: rows[0].endereco,
						bairro: rows[0].bairro,
						estado: rows[0].estado,
						cidade: rows[0].cidade
					})
				}
			})
	})
})

app.put('/edit/(:cep)', function (req, res, next) {
	req.assert('cep', 'CEP é necessário').notEmpty();
	req.assert('nome', 'Nome é necessário').notEmpty();
	req.assert('endereco', 'Endereco é necessário').notEmpty();
	req.assert('bairro', 'Bairro é necessário').notEmpty();
	req.assert('estado', 'Estado é necessário').notEmpty();
	req.assert('cidade', 'Cidade é necessário').notEmpty();
	var errors = req.validationErrors()

	if (!errors) {
		var user = {
			cep: req.sanitize('cep').escape().trim(),
			nome: req.sanitize('nome').escape().trim(),
			endereco: req.sanitize('endereco').escape().trim(),
			bairro: req.sanitize('bairro').escape().trim(),
			estado: req.sanitize('estado').escape().trim(),
			cidade: req.sanitize('cidade').escape().trim()
		}

		req.getConnection(function (error, conn) {
			conn.query('UPDATE dados_dep SET ? WHERE cep = ' +
				req.params.cep, user, function (err, result) {
					if (err) {
						req.flash('error', err)
						res.render('cep/edit', {
							title: 'Editar CEP',
							cep: req.params.cep,
							nome: req.params.nome,
							endereco: req.params.endereco,
							bairro: req.params.bairro,
							estado: req.params.estado,
							cidade: req.params.cidade
						})
					} else {
						req.flash('success', 'CEP atualizado com sucesso!')

						res.render('cep/edit', {
							title: 'Editar CEP',
							id: req.params.id,
							cep: req.params.cep,
							nome: req.params.nome,
							endereco: req.params.endereco,
							bairro: req.params.bairro,
							estado: req.params.estado,
							cidade: req.params.cidade
						})
					}
				})
		})
	}
	else {
		var error_msg = ''
		errors.forEach(function (error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		res.render('cep/edit', {
			title: 'Edit User',
			id: req.params.id,
			cep: req.body.cep,
			nome: req.body.nome,
			endereco: req.body.endereco,
			bairro: req.body.bairro,
			estado: req.body.estado,
			cidade: req.body.cidade
		})
	}
})

app.delete('/delete/(:cep)', function (req, res, next) {
	var user = { cep: req.params.cep }

	req.getConnection(function (error, conn) {
		conn.query('DELETE FROM dados_dep WHERE cep = ' +
			req.params.cep, user, function (err, result) {
				if (err) {
					req.flash('error', err)
					res.redirect('/cep')
				} else {
					req.flash('success', 'CEP deletado! cep = ' + req.params.cep)
					res.redirect('/cep')
				}
			})
	})
})

module.exports = app
