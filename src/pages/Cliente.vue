<template>
  <q-page class="container" padding>
    <p class="text-h3">Cliente</p>

    <div class="row">
      <div class="col-12">
        <q-table
          title="Clientes"
          :data="clientes"
          :columns="columns"
          row-key="nome"
          :filter="filter"
          :pagination="initialPagination"
          :loading="loading"
        >
        <template v-slot:top>
          <q-input outlined dense debounce="300" color="primary" v-model="filter">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-space />

          <q-btn
            color="primary"
            label="Cadastrar"
            @click="cadastrarCliente()"
          />

        </template>

        <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              icon="search"
              color="secondary"
              size="sm"
              dense
            />
            <q-btn
              icon="create"
              color="primary"
              size="sm"
              dense
            />
            <q-btn
              icon="delete"
              color="negative"
              size="sm"
              dense
            />
          </div>
        </q-td>
      </template>

        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageCliente',
  data () {
    return {
      filter: '',
      loading: false,
      initialPagination: {
        page: 1,
        rowsPerPage: 10
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        {
          name: 'nome',
          required: true,
          field: 'nome',
          label: 'Nome Cliente',
          align: 'left',
          sortable: true
        },
        {
          name: 'fantasia',
          required: true,
          field: 'fantasia',
          label: 'Nome Fantasia',
          align: 'left',
          sortable: true
        },
        {
          name: 'cnpj_cpf',
          required: true,
          field: 'cnpj_cpf',
          label: 'Cnpj',
          align: 'left',
          sortable: true
        },
        {
          name: 'action',
          // required: true,
          field: 'action',
          label: 'Ações'
          // align: 'left',
          // sortable: true
        }
      ],
      clientes: []
    }
  },
  mounted () {
    this.getClients()
  },
  methods: {
    getClients () {
      this.loading = true
      this.$axios.get('/clientes')
        .then((suc) => {
          this.clientes = suc.data
        })
        .catch((err) => {
          console.error('erro', err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    cadastrarCliente () {
      this.$router.push({ name: 'cadastroCliente' })
    }
  }
}
</script>
