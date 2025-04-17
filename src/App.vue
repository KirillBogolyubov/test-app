<template>
  <section>
    <form class="form">
      <div class="form__input">
        <input id="price" v-model="price" type="number" @input="calculateFields('price')" />
        <label for="price">Цена</label>
      </div>
      <div class="form__input">
        <input id="quantity" v-model="quantity" type="number" @input="calculateFields('quantity')" />
        <label for="quantity">Количество</label>
      </div>
      <div class="form__input">
        <input id="amount" v-model="amount" @input="calculateFields('amount')" />
        <label for="amount">Сумма</label>
      </div>
      <button @click.stop.prevent="postAmount">Отправить</button>
    </form>
    <div class="info-block">localStorage: {{localStorageData}}</div>
    <div v-if="events.length" class="event-block">
      События
      <div  v-for="(item, index) in events.slice(0, 4)" :key="index">
        {{item.message}} {{item.data}}
      </div>
    </div>
  </section>
</template>

<script setup>
import {computed, ref} from "vue";

const price = ref(0);
const quantity = ref(0);
const amount = ref(0);
const counter = ref(0);
const events = ref([]);
const localStorageData = computed(() => {
  return JSON.parse(localStorage.getItem('data') || '{}')
});


const calculateFields = (changedField) => {
  setTimeout(() => {
    if (changedField === 'price' || changedField === 'quantity') {
      amount.value = price.value * quantity.value
    }
    else if (changedField === 'amount') {
      if (price.value) {
        quantity.value = amount.value / price.value
      } else if (quantity.value) {
        price.value = amount.value / quantity.value
      }
    }
  }, 300)
  saveEvent(`Изменено поле: ${changedField}`, {
    price: price.value,
    quantity: quantity.value,
    amount: amount.value
  })
}

const saveEvent = (message, data) => {
  const event = {
    message,
    data
  }
  events.value.unshift(event)
}

const postAmount = () => {
  const data = {
    counter: counter.value++,
    price: price.value,
    quantity: quantity.value,
    amount: amount.value,
  }

  saveEvent('Отправка данных', {
    localStorageRequest: JSON.parse(localStorage.getItem('data'))
  })

  serverRequest(data).then((res) => {
    saveEvent('Response', {
      res: res,
      localStorageResponse: JSON.parse(localStorage.getItem('data') || '{}')
    })
  }).catch(err => {
    saveEvent('Response', {err})
    throw new Error(err.message)
  })
}

const serverRequest = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccessRequest = data.amount % 2 === 0

      if (isSuccessRequest) {
        localStorage.setItem('data', JSON.stringify(data))
        resolve({success: true})
      } else {
        reject({success: false})
      }
    }, 1000)
  })
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.form {
  display: flex;
  column-gap: 10px;
  margin-bottom: 20px;

  &__input {
    display: flex;
    flex-direction: column;
  }
}

.info-block {
  font-weight: bold;
  margin-bottom: 20px;
}

.event-block {
  background-color: grey;
  border-radius: 10px;
  color: white;
  font-weight: 700;
  padding: 10px;
}
</style>
