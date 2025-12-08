import { Cliente } from "./Cliente.js";

export class Dependente extends Cliente {
    constructor(idCliente, nome, email, dataNascimento, sexo) {
        super(idCliente, nome, email, dataNascimento, sexo);
    }
}