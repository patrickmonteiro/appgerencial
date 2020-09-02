<template>
  <q-page class="container" padding>
    <p class="text-h3">Cadastro de Cliente</p>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <q-input
          outlined
          v-model="form.codigo"
          label="Codigo"
          class="col-1"
          bottom-slots
        />
        <q-select
          outlined
          v-model="form.pessoa"
          :options="options"
          label="Tipo Pessoa"
          class="col-2"
          :rules="[ val => val && val.length > 0 || 'Tipo pessoa é obrigatório']"
        />
        <q-input
          outlined
          v-model="form.nome"
          label="Nome/Razão Social"
          class="col-6"
          :rules="[ val => val && val.length > 3 || 'Nome/Razão Social é obrigatório']"
        />

        <q-input
          outlined
          v-model="form.fantasia"
          label="Nome Fantasia"
          class="col-6"
          :rules="[ val => val && val.length > 3 || 'Nome Fantasia é obrigatório']"
        />

        <q-input
          outlined
          v-model="form.cnpj_cpf"
          :label=" form.pessoa === 'Fisica' ? 'CPF': 'CNPJ'"
          class="col-4"
          :mask="form.pessoa === 'Fisica' ? '###.###.###-##' : '##.###.###/####-##'"
          unmasked-value
          :rules="[ val => val && val.length > 0 || 'Cpf é obrigatório']"
        />

        <q-input
          outlined
          v-model="form.ie_rg"
          label="Inscrição Estadual/Rg "
          class="col-4"
          :rules="[ val => val && val.length > 0 || 'Inscrição Estadual/Rg é obrigatório']"
        />

        <q-input
          outlined
          v-model="form.endereco"
          label="Endereço"
          class="col-4"
          :rules="[ val => val && val.length > 0 || 'Endereço é obrigatório']"
        />
      </div>

      <div class="col-12">
        <q-btn
          label="Cadastrar"
          color="primary"
          class="float-right"
          type="submit"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
export default {
  name: 'CadastroCliente',
  data () {
    return {
      form: {
        codigo: null,
        nome: '',
        pessoa: '',
        cnpj_cpf: '',
        fantasia: ''
      },
      options: [
        'Fisica',
        'Juridica'
      ]
    }
  },
  methods: {
    onSubmit () {
      this.$axios.post('clientes', {
        ...this.form
      })
        .then(() => {
          this.$q.notify({
            message: 'Cliente Cadastrado com Sucesso.',
            icon: 'check_circle_outline',
            color: 'positive'
          })
          this.$router.push('cliente')
        })
        .catch((err) => {
          this.$q.notify({
            message: 'Erro ao cadastrar Cliente.',
            icon: 'check_circle_outline',
            color: 'negative'
          })
          console.error('erro cadastro cliente', err)
        })
    }
  }
}
</script>
