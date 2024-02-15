function url(data) {
  console.log(data)
  let queryParams = '';
  for (let key in data) {
    if (data[key]) {
      queryParams += `&${key}=${data[key]}`;
    }
  }

  const baseUrl = 'https://bi.prms.cgiar.org/bi'

  const url = `${baseUrl}/${data?.reportName ?? 'cgiar-results-dashboard'}${queryParams ? '?' : ''}${queryParams}`;
  console.log(url);
  return url;
}
let widget = null;

var pbiwidget = {
  init: (divId, data) => {
    widget = document.getElementById(divId);

    let iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'iframe-dashboardEmbed');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('src', url(data));
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    // widget.style.background = 'red'
    widget.style.width = "100%";
    widget.style.height = data?.height || '1000px';
    widget.appendChild(iframe);
    // iframe.onload = function () {
    //     console.log("Iframe loaded");
    // }


  },

  // setFilters(data) {
  //   let iframe = document.getElementById('iframe-dashboardEmbed')
  //   iframe.setAttribute('src', url(data));
  // }

}
