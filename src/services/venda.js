const { Venda } = require('../models');
const { Pessoa } = require('../models');
const { ItemVenda } = require('../models');
const { Produto } = require('../models');
const { Unidade } = require('../models');

export const listVendas = async (req, res) => {
  const vendas = await Venda.findAll({
    attributes: ['id', 'dtemissao', 'nrdocumento', 'vrtotal', 'ativo', 'status', 'vrrecebido', 'pessoaId'],
    include: [
      {
        model: Pessoa,
        as: 'pessoa',
        attributes: ['id', 'nome']
      },
      {
        model: ItemVenda,
        as: 'itemVenda',
        attributes: ['id', 'quantidade', 'vrunit', 'ativo', 'produtoId', 'vendaId'],
        include: {
          model: Produto,
          as: 'produto',
          attributes: ['id', 'descricao'],
          include: {
            model: Unidade,
            as: 'unidade',
            attributes: ['sigla']
          }
        }
      }
    ],
    order: [['dtemissao', 'DESC']]
  });

  return vendas;
};

export const createVenda = async (venda) => {

  const createdVenda = await Venda.create(venda)

  await venda.itemVenda.map((item) => {
    item.vendaId = createdVenda.id
    ItemVenda.create(item)
  })

  console.log();


  return createdVenda
}

export const updateVenda = async (id, req, res) => {
  const dados = req.body;

  console.log('dados.itemVenda: ', dados.itemVenda);


  // Atualiza os dados da compra
  await Venda.update(
    {
      dtemissao: dados.dtemissao,
      nrdocumento: dados.nrdocumento,
      pessoaId: dados.pessoaId,
      vrtotal: dados.vrtotal,
      vrrecebido: dados.vrrecebido,
      status: dados.status,
      ativo: dados.ativo
    },
    { where: { id } }
  );

  // Busca os itens atuais no banco
  const itensAtuais = await ItemVenda.findAll({ where: { vendaId: id } });

  console.log('itensAtuais: ', itensAtuais);


  // Cria mapas para facilitar comparação
  const itensEnviados = dados.itemVenda?.filter(item => !item._excluir) || [];
  const idsEnviados = itensEnviados.map(item => item.id).filter(Boolean);
  const idsAtuais = itensAtuais.map(item => item.id);

  // 🔴 Excluir itens que foram removidos
  const idsParaExcluir = idsAtuais.filter(id => !idsEnviados.includes(id));

  console.log('idsParaExcluir: ', idsParaExcluir);
  console.log('idsAtuais: ', idsAtuais);


  await Promise.all(idsParaExcluir.map(id => ItemVenda.destroy({ where: { id } })));

  // 🔄 Atualizar ou criar itens
  for (const item of itensEnviados) {
    if (item.id && idsAtuais.includes(item.id)) {
      // Atualizar item existente
      await ItemVenda.update(
        {
          quantidade: item.quantidade,
          vrunit: item.vrunit,
          ativo: item.ativo,
          produtoId: item.produtoId,
          descricao: item.descricao
        },
        { where: { id: item.id } }
      );
    } else {
      // Criar novo item
      await ItemVenda.create({
        vendaId: id,
        quantidade: item.quantidade,
        vrunit: item.vrunit,
        ativo: item.ativo ?? true,
        produtoId: item.produtoId,
        descricao: item.descricao
      });
    }
  }

  // Retorna a compra atualizada
  const vendaAtualizada = await Venda.findOne({
    where: { id },
    include: [
      { model: Pessoa, as: 'pessoa', attributes: ['id', 'nome'] },
      {
        model: ItemVenda,
        as: 'itemVenda',
        include: {
          model: Produto,
          as: 'produto',
          include: { model: Unidade, as: 'unidade' }
        }
      }
    ]
  });

  return vendaAtualizada;
};

export const buscaVenda = async (id) => {
  const venda = await Venda.findOne({
    where: { id },
  })
  return venda
}

export const deleteVenda = async (id) => {

  await ItemVenda.destroy({
    where: { vendaId: id }
  })

  await Venda.destroy({
    where: { id }
  })
}

