function o(n){return"?"+Object.keys(n).filter(e=>!!n[e]).map(e=>`${e}=${encodeURIComponent(n[e])}`).join("&")}export{o};
