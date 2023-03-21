function url(data) {
    const yearParam = `&year=${data?.year}`;
    const resultTypeParam = `&resultType=${data?.resultType}`;
    const url = `https://bi.prms.cgiar.org/bi/cgiar-results-dashboard${data?.year || data?.resultType ? '?' : ''}${data?.year ? yearParam : ''}${data?.resultType ? resultTypeParam : ''}`;
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

    setFilters(data) {
        let iframe = document.getElementById('iframe-dashboardEmbed')
        iframe.setAttribute('src', url(data));
    }

}