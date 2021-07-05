import axios from "axios";
import Noty from "noty";

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