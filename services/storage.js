import { Filme } from '../models/Filme.js';
import { Item } from '../models/Item.js';
import { Cliente } from '../models/Cliente.js';
import { Titular } from '../models/Titular.js';
import { Dependente } from '../models/Dependente.js';
import { Locacao } from '../models/Locacao.js';
import { Reserva } from '../models/Reserva.js';
import { Distribuidora } from '../models/Distribuidora.js';

class StorageService {
    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    static set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // Método para hidratar filmes (converter objetos simples em instâncias de classe)
    static hidratarFilmes(filmesData) {
        if (!filmesData || !Array.isArray(filmesData)) return [];
        
        return filmesData.map(filmeData => {
            // Criar distribuidora
            const distribuidora = new Distribuidora(
                filmeData.distribuidora.idDistribuidora,
                filmeData.distribuidora.razaoSocial,
                filmeData.distribuidora.cnpj,
                filmeData.distribuidora.endereco,
                filmeData.distribuidora.telefone,
                filmeData.distribuidora.pessoaContato
            );

            // Criar filme
            const filme = new Filme(
                filmeData.idFilme,
                filmeData.tituloOriginal,
                filmeData.tituloPortugues,
                filmeData.ano,
                filmeData.pais,
                filmeData.direcao,
                filmeData.elenco,
                filmeData.sinopse,
                filmeData.duracao,
                filmeData.genero,
                filmeData.ehLancamento,
                distribuidora
            );

            // Restaurar itens
            if (filmeData.itens && Array.isArray(filmeData.itens)) {
                filme.itens = filmeData.itens.map(itemData => {
                    const item = new Item(
                        itemData.idItem,
                        itemData.numeroSerie,
                        itemData.tipoMidia,
                        itemData.dataAquisicao
                    );
                    item.status = itemData.status;
                    return item;
                });
            }

            return filme;
        });
    }

    // Método para hidratar clientes
    static hidratarClientes(clientesData) {
        if (!clientesData || !Array.isArray(clientesData)) return [];
        
        return clientesData.map(clienteData => {
            if (clienteData.cpf) {
                // É um titular
                const titular = new Titular(
                    clienteData.idCliente,
                    clienteData.nome,
                    clienteData.email,
                    clienteData.dataNascimento,
                    clienteData.sexo,
                    clienteData.endereco,
                    clienteData.telResidencial,
                    clienteData.localTrabalho,
                    clienteData.telComercial,
                    clienteData.telCelular,
                    clienteData.cpf
                );
                
                // Restaurar dependentes se houver
                if (clienteData.dependentes && Array.isArray(clienteData.dependentes)) {
                    titular.dependentes = clienteData.dependentes.map(depData => 
                        new Dependente(
                            depData.idCliente,
                            depData.nome,
                            depData.email,
                            depData.dataNascimento,
                            depData.sexo
                        )
                    );
                }
                
                return titular;
            } else {
                // É um dependente
                return new Dependente(
                    clienteData.idCliente,
                    clienteData.nome,
                    clienteData.email,
                    clienteData.dataNascimento,
                    clienteData.sexo
                );
            }
        });
    }

    static getFilmes() {
        const filmesData = this.get('filmes') || [];
        return this.hidratarFilmes(filmesData);
    }

    static setFilmes(filmes) {
        this.set('filmes', filmes);
    }

    static getClientes() {
        const clientesData = this.get('clientes') || [];
        return this.hidratarClientes(clientesData);
    }

    static setClientes(clientes) {
        this.set('clientes', clientes);
    }

    static getLocacoes() {
        return this.get('locacoes') || [];
    }

    static setLocacoes(locacoes) {
        this.set('locacoes', locacoes);
    }

    static getReservas() {
        return this.get('reservas') || [];
    }

    static setReservas(reservas) {
        this.set('reservas', reservas);
    }

    static getContadorId() {
        return parseInt(localStorage.getItem('contadorId') || '1');
    }

    static setContadorId(id) {
        localStorage.setItem('contadorId', id.toString());
    }

    static incrementarContador() {
        const atual = this.getContadorId();
        this.setContadorId(atual + 1);
        return atual;
    }
}

export default StorageService;