const ADMIN=location.pathname.includes("/admin/");
const R=ADMIN?"../":"";
const PAGE=document.body.dataset.page;
const $=s=>document.querySelector(s);
const money=n=>"$"+Number(n).toLocaleString("es-CL");
const get=(k,d=[])=>JSON.parse(localStorage.getItem(k)||"null")??d;
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const iniciales=[
{id:1,codigo:"TOR001",nombre:"Torta de Chocolate",descripcion:"Torta artesanal de chocolate con suave relleno de crema.",precio:18990,stock:12,critico:3,categoria:"Tortas",img:"img/torta-chocolate.jpg"},
{id:2,codigo:"TOR002",nombre:"Torta de Frutilla",descripcion:"Bizcocho suave con crema y frutillas frescas.",precio:19990,stock:8,critico:2,categoria:"Tortas",img:"img/torta-frutilla.jpg"},
{id:3,codigo:"PAS001",nombre:"Cheesecake",descripcion:"Cheesecake cremoso con base de galleta.",precio:14990,stock:9,critico:2,categoria:"Pasteles",img:"img/cheesecake.jpg"},
{id:4,codigo:"PAS002",nombre:"Pie de Limón",descripcion:"Pie artesanal con crema de limón y merengue.",precio:12990,stock:15,critico:3,categoria:"Pasteles",img:"img/pie-limon.jpg"},
{id:5,codigo:"DUL001",nombre:"Cupcakes",descripcion:"Caja de seis cupcakes decorados.",precio:9990,stock:20,critico:5,categoria:"Dulces",img:"img/cupcakes.jpg"},
{id:6,codigo:"DUL002",nombre:"Alfajores",descripcion:"Caja de alfajores rellenos con manjar.",precio:7990,stock:25,critico:5,categoria:"Dulces",img:"img/alfajores.jpg"}
];

if(!localStorage.getItem("productos"))save("productos",iniciales);

if(!localStorage.getItem("usuarios"))save("usuarios",[
{id:1,run:"",nombre:"Administrador",apellidos:"Mil Sabores",correo:"admin@duoc.cl",password:"1234",rol:"Administrador",region:"",comuna:"",direccion:"Pastelería Mil Sabores"},
{id:2,run:"",nombre:"Vendedor",apellidos:"Mil Sabores",correo:"vendedor@duoc.cl",password:"1234",rol:"Vendedor",region:"",comuna:"",direccion:"Pastelería Mil Sabores"}
]);

const REGIONES=[
{n:"Metropolitana de Santiago",c:["Santiago","Renca","Maipú","Providencia","Las Condes"]},
{n:"Valparaíso",c:["Valparaíso","Viña del Mar","Quilpué"]},
{n:"Biobío",c:["Concepción","Talcahuano","Los Ángeles"]}
];

/* REEMPLAZAR REGIONES POR EL ARREGLO OFICIAL ENTREGADO POR EL DOCENTE */

function productos(){return get("productos")}
function usuarios(){return get("usuarios")}
function carrito(){return get("carrito")}
function actual(){return get("usuarioActual",null)}

function cartCount(){
 const e=$("#cartCount");if(e)e.textContent=carrito().reduce((a,x)=>a+x.cantidad,0);
}

function header(){
 let u=actual();

 if(ADMIN){
  $("#header").innerHTML=`
  <div class="top">
   <a class="brand" href="../index.html">
    <img src="../img/logo.png" alt="Logo">Mil Sabores
   </a>
   <nav>
    <a href="index.html">Inicio</a>
    <a href="productos.html">Productos</a>
    ${u?.rol==="Administrador"?'<a href="usuarios.html">Usuarios</a>':""}
    <a href="../index.html">Tienda</a>
    <button onclick="logout()">Salir</button>
   </nav>
  </div>`;
 }else{
  $("#header").innerHTML=`
  <div class="top">
   <a class="brand" href="index.html">
    <img src="img/logo.png" alt="Logo">Mil Sabores
   </a>
   <nav>
    <a href="index.html">Inicio</a>
    <a href="productos.html">Productos</a>
    <a href="nosotros.html">Nosotros</a>
    <a href="blog.html">Blog</a>
    <a href="contacto.html">Contacto</a>
    <a href="login.html">Ingresar</a>
    <a href="carrito.html">🛒 (<span id="cartCount">0</span>)</a>
   </nav>
  </div>`;
 }
}

function footer(){
 $("#footer").innerHTML=`<p>© 2026 Pastelería Mil Sabores · Todos los derechos reservados</p>`;
}

function card(p){
 return `<article class="card">
  <a href="${R}producto.html?id=${p.id}">
   <img src="${R+p.img}" alt="${p.nombre}">
   <h3>${p.nombre}</h3>
  </a>
  <p>${p.descripcion}</p>
  <p class="price">${money(p.precio)}</p>
  <button onclick="addCart(${p.id})">Añadir al carrito</button>
 </article>`;
}

function addCart(id){
 let c=carrito(),x=c.find(x=>x.id===id);
 x?x.cantidad++:c.push({id,cantidad:1});
 save("carrito",c);cartCount();
 alert("Producto agregado al carrito");
}

function removeCart(id){
 save("carrito",carrito().filter(x=>x.id!==id));
 renderCarrito();cartCount();
}

function changeQty(id,n){
 let c=carrito(),x=c.find(x=>x.id===id);
 if(x)x.cantidad=Math.max(1,x.cantidad+n);
 save("carrito",c);renderCarrito();cartCount();
}

function renderHome(){
 $("#app").innerHTML=`
 <section class="hero">
  <div>
   <h1>Pastelería Mil Sabores</h1>
   <p>Tradición, sabor y dulzura en cada preparación.</p>
   <a class="btn" href="productos.html">Ver productos</a>
  </div>
  <img src="img/hero-pasteleria.jpg" alt="Pastelería Mil Sabores">
 </section>
 <h2>Productos destacados</h2>
 <section class="grid">${productos().slice(0,3).map(card).join("")}</section>`;
}

function renderProductos(){
 $("#app").innerHTML=`<h1>Nuestros productos</h1>
 <section class="grid">${productos().map(card).join("")}</section>`;
}

function renderProducto(){
 let id=Number(new URLSearchParams(location.search).get("id"));
 let p=productos().find(x=>x.id===id)||productos()[0];

 $("#app").innerHTML=`
 <section class="hero">
  <img src="${p.img}" alt="${p.nombre}">
  <div>
   <h1>${p.nombre}</h1>
   <p>${p.descripcion}</p>
   <p><b>Categoría:</b> ${p.categoria}</p>
   <p class="price">${money(p.precio)}</p>
   <p>Stock disponible: ${p.stock}</p>
   <button onclick="addCart(${p.id})">Añadir al carrito</button>
  </div>
 </section>
 <h2>También te puede gustar</h2>
 <section class="grid">${productos().filter(x=>x.id!==p.id).slice(0,3).map(card).join("")}</section>`;
}

function renderCarrito(){
 let c=carrito(),ps=productos();

 if(!c.length){
  $("#app").innerHTML="<h1>Mi carrito</h1><p>Tu carrito está vacío.</p>";
  return;
 }

 let total=0;
 let html=c.map(x=>{
  let p=ps.find(y=>y.id===x.id);if(!p)return "";
  total+=p.precio*x.cantidad;
  return `<div class="cart-item">
   <img src="${p.img}" alt="${p.nombre}">
   <div>
    <h3>${p.nombre}</h3>
    <p>${money(p.precio)}</p>
    <button onclick="changeQty(${p.id},-1)">−</button>
    <b>${x.cantidad}</b>
    <button onclick="changeQty(${p.id},1)">+</button>
   </div>
   <button onclick="removeCart(${p.id})">Eliminar</button>
  </div>`;
 }).join("");

 $("#app").innerHTML=`<h1>Mi carrito de compras</h1>${html}
 <p class="total">Total: ${money(total)}</p>
 <button onclick="alert('Compra simulada correctamente')">Pagar</button>`;
}

function renderNosotros(){
 $("#app").innerHTML=`
 <h1>Nosotros</h1>
 <p><b>Pastelería Mil Sabores</b> nace con el propósito de entregar productos de pastelería preparados con dedicación y materias primas seleccionadas.</p>
 <p>Nuestra misión es crear momentos especiales mediante tortas, pasteles y dulces artesanales.</p>
 <h2>Equipo desarrollador</h2>
 <p>Aquí escribe los nombres de todos los integrantes de tu grupo.</p>`;
}

function renderBlog(){
 $("#app").innerHTML=`
 <h1>Noticias y consejos</h1>

 <article class="blog">
  <div><h2>¿Cómo elegir la torta perfecta?</h2>
  <p>Conoce algunos consejos para elegir una torta para cada ocasión.</p>
  <a class="btn" href="blog1.html">Ver artículo</a></div>
  <img src="img/blog1.jpg" alt="Tortas">
 </article>

 <article class="blog">
  <img src="img/blog2.jpg" alt="Pastelería">
  <div><h2>El secreto de nuestros sabores</h2>
  <p>Descubre cómo elaboramos nuestros productos artesanales.</p>
  <a class="btn" href="blog2.html">Ver artículo</a></div>
 </article>`;
}

function blogDetalle(n){
 $("#app").innerHTML=n===1?`
 <h1>¿Cómo elegir la torta perfecta?</h1>
 <img src="img/blog1.jpg" alt="Torta">
 <p>Antes de elegir una torta considera la cantidad de invitados, los sabores preferidos y el tipo de celebración. En Mil Sabores contamos con distintas alternativas para compartir momentos especiales.</p>
 `:`
 <h1>El secreto de nuestros sabores</h1>
 <img src="img/blog2.jpg" alt="Pastelería">
 <p>La calidad de una preparación comienza con sus ingredientes. Buscamos combinar recetas tradicionales con una presentación atractiva y productos frescos.</p>`;
}

const emailOK=e=>/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(e);

function renderLogin(){
 $("#app").innerHTML=`
 <h1>Inicio de sesión</h1>
 <form id="loginForm">
  <label>Correo</label>
  <input id="correo" maxlength="100">
  <label>Contraseña</label>
  <input id="password" type="password" maxlength="10">
  <button>Ingresar</button>
  <p class="msg"></p>
  <p><small>Administrador demo: admin@duoc.cl / 1234</small></p>
 </form>`;
 $("#loginForm").onsubmit=login;
}

function login(e){
 e.preventDefault();
 let correo=$("#correo").value.trim(),pass=$("#password").value;
 if(!emailOK(correo))return msg("Ingrese un correo @duoc.cl, @profesor.duoc.cl o @gmail.com");
 if(pass.length<4||pass.length>10)return msg("La contraseña debe tener entre 4 y 10 caracteres");

 let u=usuarios().find(x=>x.correo.toLowerCase()===correo.toLowerCase()&&x.password===pass);
 if(!u)return msg("Correo o contraseña incorrectos");

 save("usuarioActual",u);
 location.href=u.rol==="Administrador"||u.rol==="Vendedor"?"admin/index.html":"index.html";
}

function msg(t,ok=false){
 let m=$(".msg");if(m){m.textContent=t;m.className="msg"+(ok?" ok":"");}
}

function renderContacto(){
 $("#app").innerHTML=`
 <h1>Contacto</h1>
 <form id="contactForm">
  <label>Nombre</label>
  <input id="nombre" maxlength="100">
  <label>Correo</label>
  <input id="correo" maxlength="100">
  <label>Comentario</label>
  <textarea id="comentario" maxlength="500"></textarea>
  <button>Enviar mensaje</button>
  <p class="msg"></p>
 </form>`;

 $("#contactForm").onsubmit=e=>{
  e.preventDefault();
  let n=$("#nombre").value.trim(),c=$("#correo").value.trim(),t=$("#comentario").value.trim();
  if(!n)return msg("El nombre es obligatorio");
  if(c&&!emailOK(c))return msg("Correo no permitido");
  if(!t)return msg("El comentario es obligatorio");
  msg("Mensaje enviado correctamente",true);
  e.target.reset();
 };
}

function validarRun(run){
 run=run.replace(/[.\-]/g,"").toUpperCase();
 if(run.length<7||run.length>9)return false;
 let cuerpo=run.slice(0,-1),dv=run.slice(-1),s=0,m=2;
 for(let i=cuerpo.length-1;i>=0;i--){s+=+cuerpo[i]*m;m=m===7?2:m+1}
 let r=11-s%11,calc=r===11?"0":r===10?"K":String(r);
 return dv===calc;
}

function opcionesRegiones(){
 return `<option value="">Seleccione</option>`+
 REGIONES.map(r=>`<option>${r.n}</option>`).join("");
}

function actualizarComunas(sel=""){
 let r=REGIONES.find(x=>x.n===$("#region").value);
 $("#comuna").innerHTML=`<option value="">Seleccione</option>`+
 (r?r.c.map(c=>`<option ${c===sel?"selected":""}>${c}</option>`).join(""):"");
}

function userForm(admin=false){
 let id=Number(new URLSearchParams(location.search).get("id"));
 let u=admin?usuarios().find(x=>x.id===id):null;

 $("#app").innerHTML=`
 <h1>${admin?(u?"Editar usuario":"Nuevo usuario"):"Registro de usuario"}</h1>
 <form id="userForm">
  <label>RUN sin puntos ni guion</label>
  <input id="run" maxlength="9" value="${u?.run||""}">
  <label>Nombre</label>
  <input id="nombre" maxlength="50" value="${u?.nombre||""}">
  <label>Apellidos</label>
  <input id="apellidos" maxlength="100" value="${u?.apellidos||""}">
  <label>Correo</label>
  <input id="correo" maxlength="100" value="${u?.correo||""}">
  <label>Contraseña</label>
  <input id="password" type="password" maxlength="10" value="${u?.password||""}">
  <label>Fecha de nacimiento</label>
  <input id="fecha" type="date" value="${u?.fecha||""}">
  ${admin?`<label>Tipo de usuario</label>
  <select id="rol">
   ${["Administrador","Cliente","Vendedor"].map(r=>`<option ${u?.rol===r?"selected":""}>${r}</option>`).join("")}
  </select>`:""}
  <label>Región</label>
  <select id="region">${opcionesRegiones()}</select>
  <label>Comuna</label>
  <select id="comuna"><option value="">Seleccione</option></select>
  <label>Dirección</label>
  <input id="direccion" maxlength="300" value="${u?.direccion||""}">
  <button>Guardar</button>
  <p class="msg"></p>
 </form>`;

 if(u?.region)$("#region").value=u.region;
 actualizarComunas(u?.comuna);
 $("#region").onchange=()=>actualizarComunas();

 $("#userForm").onsubmit=e=>{
  e.preventDefault();
  let data={
   id:u?.id||Date.now(),
   run:$("#run").value.trim().toUpperCase(),
   nombre:$("#nombre").value.trim(),
   apellidos:$("#apellidos").value.trim(),
   correo:$("#correo").value.trim(),
   password:$("#password").value,
   fecha:$("#fecha").value,
   rol:admin?$("#rol").value:"Cliente",
   region:$("#region").value,
   comuna:$("#comuna").value,
   direccion:$("#direccion").value.trim()
  };

  if(!validarRun(data.run))return msg("RUN inválido");
  if(!data.nombre)return msg("El nombre es obligatorio");
  if(!data.apellidos)return msg("Los apellidos son obligatorios");
  if(!emailOK(data.correo))return msg("Correo no permitido");
  if(data.password.length<4||data.password.length>10)return msg("Contraseña entre 4 y 10 caracteres");
  if(!data.direccion)return msg("La dirección es obligatoria");

  let us=usuarios(),pos=us.findIndex(x=>x.id===data.id);
  pos>=0?us[pos]=data:us.push(data);
  save("usuarios",us);

  admin?location.href="usuarios.html":(msg("Registro exitoso",true),e.target.reset());
 };
}

function guardAdmin(){
 if(!ADMIN)return true;
 let u=actual();
 if(!u||!["Administrador","Vendedor"].includes(u.rol)){
  location.href="../login.html";
  return false;
 }
 return true;
}

function adminHome(){
 let u=actual();
 $("#app").innerHTML=`
 <h1>Hola, ${u.nombre}</h1>
 <p>Panel de administración de Pastelería Mil Sabores.</p>
 <section class="admin-boxes">
  <div class="admin-box"><h2>${productos().length}</h2><p>Productos</p></div>
  ${u.rol==="Administrador"?`<div class="admin-box"><h2>${usuarios().length}</h2><p>Usuarios</p></div>`:""}
 </section>`;
}

function adminProductos(){
 let admin=actual().rol==="Administrador";

 $("#app").innerHTML=`
 <h1>Productos</h1>
 ${admin?'<p><a class="btn" href="producto-form.html">Nuevo producto</a></p>':""}
 <table>
  <thead><tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
  <tbody>${productos().map(p=>`
   <tr>
    <td>${p.codigo}</td><td>${p.nombre}</td><td>${money(p.precio)}</td>
    <td>${p.stock}${p.critico!==""&&p.stock<=p.critico?" ⚠️":""}</td>
    <td class="actions">
     <a class="btn" href="producto-ver.html?id=${p.id}">Ver</a>
     ${admin?`<a class="btn" href="producto-form.html?id=${p.id}">Editar</a>
     <button onclick="deleteProduct(${p.id})">Eliminar</button>`:""}
    </td>
   </tr>`).join("")}
  </tbody>
 </table>`;
}

function deleteProduct(id){
 if(confirm("¿Eliminar producto?")){
  save("productos",productos().filter(x=>x.id!==id));
  adminProductos();
 }
}

function productForm(){
 let id=Number(new URLSearchParams(location.search).get("id"));
 let p=productos().find(x=>x.id===id);

 $("#app").innerHTML=`
 <h1>${p?"Editar":"Nuevo"} producto</h1>
 <form id="productForm">
  <label>Código</label><input id="codigo" value="${p?.codigo||""}">
  <label>Nombre</label><input id="nombre" maxlength="100" value="${p?.nombre||""}">
  <label>Descripción</label><textarea id="descripcion" maxlength="500">${p?.descripcion||""}</textarea>
  <label>Precio</label><input id="precio" type="number" min="0" step="0.01" value="${p?.precio??""}">
  <label>Stock</label><input id="stock" type="number" min="0" step="1" value="${p?.stock??""}">
  <label>Stock crítico</label><input id="critico" type="number" min="0" step="1" value="${p?.critico??""}">
  <label>Categoría</label>
  <select id="categoria">
   ${["Tortas","Pasteles","Dulces"].map(x=>`<option ${p?.categoria===x?"selected":""}>${x}</option>`).join("")}
  </select>
  <label>Ruta imagen (opcional)</label><input id="imagen" value="${p?.img||""}" placeholder="img/producto.jpg">
  <button>Guardar</button>
  <p class="msg"></p>
 </form>`;

 $("#productForm").onsubmit=e=>{
  e.preventDefault();
  let x={
   id:p?.id||Date.now(),
   codigo:$("#codigo").value.trim(),
   nombre:$("#nombre").value.trim(),
   descripcion:$("#descripcion").value.trim(),
   precio:Number($("#precio").value),
   stock:Number($("#stock").value),
   critico:$("#critico").value===""?"":Number($("#critico").value),
   categoria:$("#categoria").value,
   img:$("#imagen").value.trim()||"img/producto.jpg"
  };

  if(x.codigo.length<3)return msg("El código debe tener mínimo 3 caracteres");
  if(!x.nombre)return msg("El nombre es obligatorio");
  if(x.precio<0)return msg("Precio inválido");
  if(!Number.isInteger(x.stock)||x.stock<0)return msg("Stock inválido");
  if(x.critico!==""&&(!Number.isInteger(x.critico)||x.critico<0))return msg("Stock crítico inválido");

  let ps=productos(),pos=ps.findIndex(y=>y.id===x.id);
  pos>=0?ps[pos]=x:ps.push(x);
  save("productos",ps);
  location.href="productos.html";
 };
}

function productView(){
 let id=Number(new URLSearchParams(location.search).get("id"));
 let p=productos().find(x=>x.id===id);
 if(!p)return $("#app").innerHTML="<p>Producto no encontrado.</p>";

 $("#app").innerHTML=`
 <h1>${p.nombre}</h1>
 <p><b>Código:</b> ${p.codigo}</p>
 <p><b>Descripción:</b> ${p.descripcion}</p>
 <p><b>Precio:</b> ${money(p.precio)}</p>
 <p><b>Stock:</b> ${p.stock}</p>
 <p><b>Stock crítico:</b> ${p.critico||"No definido"}</p>
 <p><b>Categoría:</b> ${p.categoria}</p>`;
}

function adminUsuarios(){
 if(actual().rol!=="Administrador")return location.href="index.html";

 $("#app").innerHTML=`
 <h1>Usuarios</h1>
 <p><a class="btn" href="usuario-form.html">Nuevo usuario</a></p>
 <table>
  <thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
  <tbody>${usuarios().map(u=>`
   <tr>
    <td>${u.run||"-"}</td>
    <td>${u.nombre} ${u.apellidos}</td>
    <td>${u.correo}</td>
    <td>${u.rol}</td>
    <td class="actions">
     <a class="btn" href="usuario-ver.html?id=${u.id}">Ver</a>
     <a class="btn" href="usuario-form.html?id=${u.id}">Editar</a>
     <button onclick="deleteUser(${u.id})">Eliminar</button>
    </td>
   </tr>`).join("")}
  </tbody>
 </table>`;
}

function deleteUser(id){
 if(id<=2)return alert("Los usuarios de demostración no se eliminan.");
 if(confirm("¿Eliminar usuario?")){
  save("usuarios",usuarios().filter(x=>x.id!==id));
  adminUsuarios();
 }
}

function userView(){
 let id=Number(new URLSearchParams(location.search).get("id"));
 let u=usuarios().find(x=>x.id===id);
 if(!u)return $("#app").innerHTML="<p>Usuario no encontrado.</p>";

 $("#app").innerHTML=`
 <h1>${u.nombre} ${u.apellidos}</h1>
 <p><b>RUN:</b> ${u.run||"-"}</p>
 <p><b>Correo:</b> ${u.correo}</p>
 <p><b>Rol:</b> ${u.rol}</p>
 <p><b>Región:</b> ${u.region||"-"}</p>
 <p><b>Comuna:</b> ${u.comuna||"-"}</p>
 <p><b>Dirección:</b> ${u.direccion||"-"}</p>`;
}

function logout(){
 localStorage.removeItem("usuarioActual");
 location.href=ADMIN?"../login.html":"login.html";
}

function render(){
 if(!guardAdmin())return;

 header();footer();cartCount();

 const pages={
  home:renderHome,
  productos:renderProductos,
  producto:renderProducto,
  carrito:renderCarrito,
  nosotros:renderNosotros,
  blog:renderBlog,
  blog1:()=>blogDetalle(1),
  blog2:()=>blogDetalle(2),
  login:renderLogin,
  contacto:renderContacto,
  registro:()=>userForm(false),
  "admin-home":adminHome,
  "admin-productos":adminProductos,
  "admin-producto-form":productForm,
  "admin-producto-ver":productView,
  "admin-usuarios":adminUsuarios,
  "admin-usuario-form":()=>userForm(true),
  "admin-usuario-ver":userView
 };

 pages[PAGE]?.();
}

render();