export class Cliente {
    constructor(idCliente, nome, email, dataNascimento, sexo) {
        this.idCliente = idCliente;
        this.nome = nome;
        this.email = email;
        this.dataNascimento = dataNascimento;
        this.sexo = sexo;
    }

    ehMaiorDeIdade() {
        const hoje = new Date();
        const nascimento = new Date(this.dataNascimento);

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();

        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;

        return idade >= 18;
    }
}