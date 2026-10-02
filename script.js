const products = [
  {id:"high-protein-laddu", name:"High Protein Laddu", tag:"High Protein", desc:"Cashew, almond, walnut, dates, sesame, desi ghee & jaggery.", price:0, image:"assets/high-protein-laddu.jpg"},
  {id:"high-protein-burfi", name:"High Protein Burfi", tag:"High Protein", desc:"Nuts and seeds combined into a rich, traditional-style burfi.", price:0, image:"assets/high-protein-burfi.jpg"},
  {id:"peanut-laddu", name:"Peanut Laddu", tag:"Simple • Nutritious", desc:"Roasted peanuts, jaggery, sesame, cardamom and desi ghee.", price:0, image:"assets/peanut-laddu.jpg"},
  {id:"peanut-burfi", name:"Peanut Burfi", tag:"Crunchy • Tasty", desc:"Peanuts, sesame, cardamom, desi ghee and natural sweetness.", price:0, image:"assets/peanut-burfi.jpg"},
  {id:"shakti-protein", name:"Shakti Protein Powder", tag:"Plant Protein", desc:"A wholesome blend featuring nuts, seeds, makhana and dates.", price:0, image:"assets/shakti-protein.jpg"}
];

let cart = JSON.parse(localStorage.getItem("rudranshCart") || "[]");

const grid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function money(p){ return p > 0 ? `₹${p.toLocaleString("en-IN")}` : "Price on request"; }

function renderProducts(){
  grid.innerHTML = products.map(p => `
    <article class="product">
      <div class="product-img"><img src="${p.image}" alt="${p.name}"></div>
      <div class="product-body">
        <span class="tag">${p.tag}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-foot">
          <span class="price">${money(p.price)}</span>
          <button class="add" onclick="addToCart('${p.id}')">Add to cart</button>
        </div>
      </div>
    </article>`).join("");
}

function save(){ localStorage.setItem("rudranshCart", JSON.stringify(cart)); renderCart(); }

window.addToCart = function(id){
  const found = cart.find(x => x.id === id);
  if(found) found.qty++;
  else cart.push({id, qty:1});
  save();
  openCart();
};

function renderCart(){
  const count = cart.reduce((n,x)=>n+x.qty,0);
  document.getElementById("cartCount").textContent = count;
  const box = document.getElementById("cartItems");
  if(!cart.length){
    box.innerHTML = `<div style="padding:45px 0;text-align:center;color:#68726b">Your cart is empty.<br><br><a class="text-link" href="#products" onclick="closeCart()">Explore products →</a></div>`;
  } else {
    box.innerHTML = cart.map(item=>{
      const p = products.find(x=>x.id===item.id);
      return `<div class="cart-row">
        <img src="${p.image}" alt="${p.name}">
        <div><h4>${p.name}</h4><small>${money(p.price)}</small>
          <div class="qty"><button onclick="changeQty('${p.id}',-1)">−</button><span>${item.qty}</span><button onclick="changeQty('${p.id}',1)">+</button></div>
        </div>
        <button style="border:0;background:none;color:#9b3b2d;cursor:pointer" onclick="removeItem('${p.id}')">Remove</button>
      </div>`;
    }).join("");
  }
  document.getElementById("cartTotal").textContent = count;
}

window.changeQty = function(id,delta){
  const item = cart.find(x=>x.id===id); if(!item) return;
  item.qty += delta; if(item.qty<=0) cart=cart.filter(x=>x.id!==id); save();
};
window.removeItem = function(id){ cart=cart.filter(x=>x.id!==id); save(); };

function openCart(){ cartDrawer.classList.add("open"); overlay.classList.add("show"); }
function closeCart(){ cartDrawer.classList.remove("open"); overlay.classList.remove("show"); }
document.getElementById("openCart").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
overlay.onclick=closeCart;

function orderWhatsApp(){
  if(!cart.length){ alert("Please add a product first."); return; }
  const lines = cart.map(item=>{
    const p=products.find(x=>x.id===item.id);
    return `• ${p.name} x ${item.qty}`;
  });
  const msg = `Hello Rudransh Food Venture,%0A%0AI would like to enquire/order:%0A${encodeURIComponent(lines.join("\n"))}%0A%0APlease share availability, pack size and final price.`;
  // Replace the number below with your actual WhatsApp business number.
  window.open(`https://wa.me/919337412622?text=${msg}`,"_blank");
}
document.getElementById("checkoutBtn").onclick=orderWhatsApp;
document.getElementById("whatsappAll").onclick=()=>{ cart.length ? orderWhatsApp() : window.open("https://wa.me/919337412622?text=Hello%20Rudransh%20Food%20Venture,%20I%20would%20like%20to%20know%20about%20your%20products.","_blank"); };

const menuBtn=document.getElementById("menuBtn");
const nav=document.getElementById("mainNav");
menuBtn.onclick=()=>nav.classList.toggle("open");
nav.querySelectorAll("a").forEach(a=>a.onclick=()=>nav.classList.remove("open"));
document.getElementById("year").textContent=new Date().getFullYear();

renderProducts();
renderCart();
