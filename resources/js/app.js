(function () {var script=document.createElement('script');script.src="//cdn.jsdelivr.net/npm/eruda";document.body.appendChild(script); script.onload = function () { eruda.init() } })();

import axios from "axios";
import Noty from "noty";
import moment from 'moment';
import { initAdmin } from './admin';

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

let logbtn = document.querySelector("#logbt")
logbtn.addEventListener('click', () => {
                console.log(order);
                console.log(adminAreaPath);
         })


let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order);
let time = document.createElement('small');

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

// Socket
let socket = io()

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')) {
         console.log("done");
    socket.emit('join', 'adminRoom')
initAdmin(socket)
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
})