import { Cliente } from "./Cliente.js";

export class Titular extends Cliente {
    constructor(idCliente, nome, email, dataNascimento, sexo, endereco, telResidencial, localTrabalho, telComercial, telCelular, cpf) {
        super(idCliente, nome, email, dataNascimento, sexo);
        
        this.endereco = endereco;
        this.telResidencial = telResidencial;
        this.localTrabalho = localTrabalho;
        this.telComercial = telComercial;
        this.telCelular = telCelular;
        this.cpf = cpf;

        this.dependentes = [];

        if (!this.ehMaiorDeIdade())
            throw new Error("Titular deve ser maior de idade.");
    }

    adicionarDependente(dep) {
        if (this.dependentes.length >= 3)
            throw new Error("Máximo de 3 dependentes.");

        this.dependentes.push(dep);
    }

    removerDependente(id) {
        this.dependentes = this.dependentes.filter(d => d.idCliente !== id);
    }
}