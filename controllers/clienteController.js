import StorageService from '../services/storage.js';
import { Titular } from '../models/Titular.js';
import { Dependente } from '../models/Dependente.js';

class ClienteController {
    constructor() {
        this.clientes = StorageService.getClientes();
    }

    listarClientes() {
        return this.clientes;
    }

    buscarClientePorId(id) {
        return this.clientes.find(c => c.idCliente === id);
    }

    cadastrarCliente(tipo, dados) {
        const id = StorageService.incrementarContador();
        let cliente;

        if (tipo === 'titular') {
            cliente = new Titular(
                id,
                dados.nome,
                dados.email,
                dados.dataNascimento,
                dados.sexo,
                dados.endereco,
                dados.telResidencial,
                dados.localTrabalho,
                dados.telComercial,
                dados.telCelular,
                dados.cpf
            );
        } else {
            cliente = new Dependente(
                id,
                dados.nome,
                dados.email,
                dados.dataNascimento,
                dados.sexo
            );
        }

        this.clientes.push(cliente);
        StorageService.setClientes(this.clientes);
        return cliente;
    }

    atualizarCliente(id, dadosAtualizados) {
        const index = this.clientes.findIndex(c => c.idCliente === id);
        if (index !== -1) {
            this.clientes[index] = { ...this.clientes[index], ...dadosAtualizados };
            StorageService.setClientes(this.clientes);
            return this.clientes[index];
        }
        return null;
    }

    removerCliente(id) {
        const index = this.clientes.findIndex(c => c.idCliente === id);
        if (index !== -1) {
            this.clientes.splice(index, 1);
            StorageService.setClientes(this.clientes);
            return true;
        }
        return false;
    }
}

export default ClienteController;