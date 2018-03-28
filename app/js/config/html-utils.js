//Light button
export function btn(text, dataname, datavalue){
  return `<button type="button" class="btn btn-light btn-lg btn-block" data-mol-${dataname}="${datavalue}">${text}</button>`;
}

//Small dark button
export function btnSmall(text, dataname, datavalue){
  return `<button type="button" class="btn btn-dark btn-block" data-mol-${dataname}="${datavalue}">${text}</button>`;
}

//Marker-style title
export function tell(text){
  return `<h2 class="intro">${text}</h2>`;
}

//Info-text in the bottom of the page
export function tellInfo(text){
  return `<p class="text-muted">${text}</p>`;
}
