<template>
  <q-page class="container" padding>
    <p class="text-h4">
      <q-icon name="supervisor_account" class="text-primary"/>
      Cadastro de Cliente
    </p>

    <q-form @submit="onSubmit">
      <div class="row q-col-gutter-x-md">
        <q-input
          outlined
          v-model="form.cdcliente"
          disable
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

        <q-select
          outlined
          v-model="form.cdestado"
          :options="optionsEstados"
          map-options
          emit-value
          option-value="cdestado"
          option-label="sigla"
          @input="setEstado()"
          label="Estado"
          class="col-2"
          :rules="[ val => val && val !== '' || 'Tipo pessoa é obrigatório']"
        />

        <q-select
          outlined
          v-model="form.cdcidade"
          :options="optionsCidades"
          :disable="form.cdestado ? false : true"
          map-options
          emit-value
          option-value="cdcidade"
          option-label="nome"
          label="Cidades"
          class="col-3"
          :rules="[ val => val && val !== '' || 'Tipo pessoa é obrigatório']"
        />

        <q-input
          v-model="form.datacadastro"
          filled
          outlined
          disable
          type="date"
          hint="Native date"
        />
      </div>

      <div class="col-12">
        <q-btn
          :label="form.cdcliente ? 'Atualizar' : 'Cadastrar'"
          color="primary"
          class="float-right"
          type="submit"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
  name: 'CadastroCliente',
  data () {
    return {
      form: {
        codigo: null,
        nome: '',
        pessoa: '',
        cnpj_cpf: '',
        fantasia: '',
        cdcidade: null,
        cdestado: null,
        datacadastro: null
      },
      options: [
        'Fisica',
        'Juridica'
      ],
      optionsEstados: [],
      optionsCidades: [],
      cidades: []
    }
  },
  mounted () {
    this.getEstados()
    this.getCidades()
    if (this.$route.query.cdcliente) {
      this.getClientePorId()
    } else {
      const timeStamp = Date.now()
      const formattedString = date.formatDate(timeStamp, 'YYYY-MM-DD')
      this.form.datacadastro = formattedString
    }
  },
  methods: {
    onSubmit () {
      if (!this.form.cdcliente) {
        this.salvaCliente()
      } else {
        this.atualizaCliente()
      }
    },
    getEstados () {
      this.$axios.get('estados')
        .then((suc) => {
          this.optionsEstados = suc.data
        })
        .catch((err) => {
          this.$q.notify({
            message: 'Erro ao recuperar Estados.',
            icon: 'check_circle_outline',
            color: 'negative'
          })
          console.error('erro getEstados', err)
        })
    },
    getCidades () {
      this.$axios.get('cidades')
        .then((suc) => {
          this.cidades = suc.data
          this.optionsCidades = this.cidade
          this.setEstado()
        })
        .catch((err) => {
          this.$q.notify({
            message: 'Erro ao recuperar Estados.',
            icon: 'check_circle_outline',
            color: 'negative'
          })
          console.error('erro getEstados', err)
        })
    },
    setEstado () {
      const estadoCodigo = this.optionsEstados.find(est => est.cdestado === this.form.cdestado)
      if (estadoCodigo) {
        this.optionsCidades = this.cidades.filter(cid => cid.estado === estadoCodigo.sigla)
      }
    },
    getClientePorId () {
      const cdcliente = this.$route.query.cdcliente
      this.$axios.get(`/clientes/${cdcliente}`)
        .then((suc) => {
          this.form = {
            ...suc.data
          }
          console.log(suc.data)
        })
        .catch((err) => {
          console.error('erro', err)
        })
    },
    salvaCliente () {
      this.$axios.post('clientes', {
        ...this.form,
        datacadastro: date.formatDate(this.form.datacadastro)
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
    },
    atualizaCliente () {
      this.$axios.put(`clientes/${this.form.cdcliente}`, {
        ...this.form,
        datacadastro: date.formatDate(this.form.datacadastro, 'YYYY-MM-DD')
      })
        .then(() => {
          this.$q.notify({
            message: 'Cliente Atualizado com Sucesso.',
            icon: 'check_circle_outline',
            color: 'positive'
          })
          this.$router.push('cliente')
        })
        .catch((err) => {
          this.$q.notify({
            message: 'Erro ao Atualizar Cliente.',
            icon: 'check_circle_outline',
            color: 'negative'
          })
          console.error('erro cadastro cliente', err)
        })
    }
  }
}
</script>
