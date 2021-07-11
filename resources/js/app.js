const body = document.querySelector("#body");
body.addEventListener('onload', () => {
                  eruda.init()
         })


import axios from "axios";
import Noty from "noty";
import moment from 'moment'

let addtocart = document.querySelectorAll('.add-to-cart')
let cartCount = document.querySelector('#cartCount')
let addbtn = document.querySelectorAll('#addbtn')
let delbtn = document.querySelectorAll('#delbtn')

function updateCart(items) {
         axios.post('/update-cart', items).then(res => {
                  console.log(res.data)
                  cartCount.innerText = res.data.totalQty
                  new Noty({
                           type: 'success',
                           timeout: 2000,
                           progressBar: false,
                           text: "Item added into the cart"
                  }).show();
         }).catch(err => {
                  new Noty({
                           type: 'error',
                           timeout: 2000,
                           progressBar: false,
                           text: "Something Went Wrong"
                  }).show();
         })
}
function additem(idi) {
         axios.post('/add-cart', idi).then(res => {
                  console.log(res.data)
                  new Noty({
                           type: 'success',
                           timeout: 2000,
                           progressBar: false,
                           text: "Item added into the cart"
                  }).show();
                  window.location.reload()
         }).catch(err => {
                  new Noty({
                           type: 'error',
                           timeout: 2000,
                           progressBar: false,
                           text: "Something Went Wrong"
                  }).show();
         })
}
function deleteitem(idi) {
         axios.post('/delete-cart', idi).then(res => {
                  console.log(res.data)
                  new Noty({
                           type: 'success',
                           timeout: 1000,
                           progressBar: false,
                           text: "Item added into the cart"
                  }).show();
                  window.location.reload()
         }).catch(err => {
                  new Noty({
                           type: 'error',
                           timeout: 1000,
                           progressBar: false,
                           text: "Something Went Wrong"
                  }).show();
         })
}


addtocart.forEach((btn) => {
         btn.addEventListener('click', (e) => {
                  let items = JSON.parse(btn.dataset.items)
                  console.log(items)
                  updateCart(items)
         })
})
addbtn.forEach((addbtn) => {
         addbtn.addEventListener('click', (e) => {
                  let itemid = addbtn.dataset.id
                  console.log(itemid)
                  let idi = {
                           _id: itemid,
                  };
                  console.log(idi)
                  additem(idi)
         })
})
delbtn.forEach((delbtn) => {
         delbtn.addEventListener('click', (e) => {
                  let itemid = delbtn.dataset.id
                  console.log(itemid)
                  let idi = {
                           _id: itemid,
                  };
                  console.log(idi)
                  deleteitem(idi)
         })
})

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if (alertMsg) {
         setTimeout(() => {
                  alertMsg.remove()
         }, 2000)
}
//admin
const orderTableBody = document.querySelector('#orderTableBody')
let orders = []
let markup

axios.get('/admin/orders', {
         headers: {
                  "X-Requested-With": "XMLHttpRequest"
         }
}).then(res => {
         orders = res.data;
         console.log(res.data);
         markup = generateMarkup(orders);
         orderTableBody.innerHTML = markup;
}).catch(err => {
         console.log(err);
})

function generateMarkup(orders) {
         return orders.map(order => {
                  return `
                  <tr>
                  <td class="border px-4 py-2 text-green-900">
                  <p>${ order._id }</p>
                  <div>${ renderItems(order.items) }</div>
                  </td>
                  <td class="border px-4 py-2">${ order.customerId }</td>
                  <td class="border px-4 py-2">${ order.address }</td>
                  <td class="border px-4 py-2">
                  <div class="inline-block relative w-64">
                  <form action="/admin/order/status" method="POST">
                  <input type="hidden" name="orderId" value="${ order._id }">
                  <select name="status" onchange="this.form.submit()"
                  class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                  <option value="order_placed"
                  ${ order.status === 'order_placed' ? 'selected': '' }>
                  Placed</option>
                  <option value="confirmed" ${ order.status === 'confirmed' ? 'selected': '' }>
                  Confirmed</option>
                  <option value="prepared" ${ order.status === 'prepared' ? 'selected': '' }>
                  Prepared</option>
                  <option value="delivered" ${ order.status === 'delivered' ? 'selected': '' }>
                  Delivered
                  </option>
                  <option value="completed" ${ order.status === 'completed' ? 'selected': '' }>
                  Completed
                  </option>
                  </select>
                  </form>
                  <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <path
                  d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                  </div>
                  </div>
                  </td>
                  <td class="border px-4 py-2">
                  ${ moment(order.createdAt).format('hh:mm A') }
                  </td>
                  </tr>
                  `
         }).join('')
}

function renderItems(items) {
         let parsedItems = Object.values(items);
         return parsedItems.map((menuItem) => {
                  return `<p>${ menuItem.item.name } - ${ menuItem.Qty } pcs </p>`
         }).join('');
}

//admin
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')
let logbtn = document.querySelector("#logbt")
logbtn.addEventListener('click', () => {
                console.log(order);
         })
function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}

updateStatus(order);